import { execFileSync, spawn, spawnSync } from "node:child_process"
import { once } from "node:events"
import {
  closeSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  openSync,
  readFileSync,
  renameSync,
  statfsSync,
  unlinkSync,
  writeFileSync,
} from "node:fs"
import { createServer } from "node:net"
import { tmpdir } from "node:os"
import path from "node:path"
import { setTimeout as delay } from "node:timers/promises"
import { fileURLToPath } from "node:url"

process.env.PLAYWRIGHT_BROWSERS_PATH ??= "0"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const modelNames = new Map([
  ["gpt-6-sol", "GPT-6 Sol"],
  ["gpt-6-luna", "GPT-6 Luna"],
  ["fable-5.1", "Fable 5.1"],
  ["glm-5.3-flash", "GLM 5.3 Flash"],
  ["gpt-6-astra", "GPT 6 Astra"],
  ["deepseek-v4-flash", "DeepSeek V4 flash 0731"],
  ["kimi-k3", "Kimi K3"],
  ["hy-4", "Hy4"],
])
const supportedModels = new Set(modelNames.keys())
const showcaseIds = [
  "standard-builder",
  "visual-frontend",
  "design-logic",
  "impeccable-full-flow",
  "artifact-builder",
  "ux-pro-reference",
  "component-system",
  "motion-bits",
  "standard-taste",
  "standard-impeccable",
  "visual-taste",
  "visual-impeccable",
  "design-ux-pro",
  "design-impeccable",
  "balanced-chain",
  "visual-premium-chain",
  "product-polish-chain",
  "max-quality-chain",
]

const minBuildFreeBytes = 16 * 1024 ** 3
const minCaptureFreeBytes = 15 * 1024 ** 3
const minMemoryFreePercent = 30
const minBuildMemoryFreePercentWithBusyCumora = 45
const minCaptureMemoryFreePercentWithBusyCumora = 35
const maxCumoraTreeRssKiB = 1.5 * 1024 ** 2
const captureLockPath = path.join(tmpdir(), "design-playwright-screenshot.lock")
const buildManifestPath = path.join(root, "out", ".screenshot-build.json")

function assertCapacity(minSystemFreeBytes, minBusyCumoraFreePercent) {
  const { bavail, bsize } = statfsSync("/")
  const systemFreeBytes = Number(bavail) * Number(bsize)

  if (systemFreeBytes < minSystemFreeBytes) {
    throw new Error(
      `This operation requires at least ${(minSystemFreeBytes / 1024 ** 3).toFixed(
        0
      )} GiB free on the system volume; found ${(
        systemFreeBytes /
        1024 ** 3
      ).toFixed(1)} GiB.`
    )
  }

  let memoryFreePercent = null
  if (process.platform === "darwin") {
    const pressure = execFileSync("/usr/bin/memory_pressure", ["-Q"], { encoding: "utf8" })
    const match = pressure.match(/System-wide memory free percentage:\s*(\d+)%/)
    memoryFreePercent = match ? Number(match[1]) : null

    if (memoryFreePercent !== null && memoryFreePercent < minMemoryFreePercent) {
      throw new Error(
        `Screenshot capture requires at least ${minMemoryFreePercent}% free memory; found ${memoryFreePercent}%.`
      )
    }
  }

  const processList = execFileSync(
    "/bin/ps",
    ["-axo", "pid=,ppid=,rss=,command="],
    { encoding: "utf8" }
  )
  if (processList.includes("next dev")) {
    throw new Error(
      "Screenshot capture against a Next.js development server is disabled after a worker-process exhaustion incident."
    )
  }

  const processes = processList
    .split("\n")
    .map((line) => line.match(/^\s*(\d+)\s+(\d+)\s+(\d+)\s+(.*)$/))
    .filter(Boolean)
    .map((match) => ({
      pid: Number(match[1]),
      ppid: Number(match[2]),
      rssKiB: Number(match[3]),
      command: match[4],
    }))
  const cumoraTreePids = new Set(
    processes.filter(({ command }) => command.includes("cumora agent computer")).map(({ pid }) => pid)
  )
  let foundDescendant = true
  while (foundDescendant) {
    foundDescendant = false
    for (const processInfo of processes) {
      if (cumoraTreePids.has(processInfo.ppid) && !cumoraTreePids.has(processInfo.pid)) {
        cumoraTreePids.add(processInfo.pid)
        foundDescendant = true
      }
    }
  }
  const cumoraTreeRssKiB = processes
    .filter(({ pid }) => cumoraTreePids.has(pid))
    .reduce((total, { rssKiB }) => total + rssKiB, 0)
  if (
    cumoraTreeRssKiB > maxCumoraTreeRssKiB &&
    (memoryFreePercent === null || memoryFreePercent < minBusyCumoraFreePercent)
  ) {
    throw new Error(
      `Cumora's process tree is using ${(cumoraTreeRssKiB / 1024 ** 2).toFixed(
        1
      )} GiB; this phase requires at least ${minBusyCumoraFreePercent}% free memory when the 1.5 GiB safety limit is exceeded.`
    )
  }
  if (cumoraTreeRssKiB > maxCumoraTreeRssKiB) {
    console.warn(
      `Cumora is using ${(cumoraTreeRssKiB / 1024 ** 2).toFixed(
        1
      )} GiB; continuing because system memory is ${memoryFreePercent}% free.`
    )
  }
}

function assertNoExistingHeadlessBrowser() {
  const processList = execFileSync("/bin/ps", ["-axo", "command="], { encoding: "utf8" })
  const hasHeadlessBrowser = processList
    .split("\n")
    .some(
      (command) =>
        (command.includes("chrome-headless-shell") || command.includes("Google Chrome for Testing")) &&
        command.includes("--headless")
    )
  if (hasHeadlessBrowser) {
    throw new Error("Another headless Chromium is already active. Refusing concurrent screenshots.")
  }
}

function acquireCaptureLock() {
  try {
    const fd = openSync(captureLockPath, "wx")
    writeFileSync(fd, `${process.pid}\n`)
    return fd
  } catch (error) {
    if (error?.code !== "EEXIST") throw error

    const ownerPid = Number(readFileSync(captureLockPath, "utf8").trim())
    try {
      process.kill(ownerPid, 0)
    } catch (ownerError) {
      if (ownerError?.code === "ESRCH") {
        unlinkSync(captureLockPath)
        return acquireCaptureLock()
      }
      throw ownerError
    }

    throw new Error(
      `Another screenshot capture is already active with pid ${ownerPid}. Refusing to run concurrently.`
    )
  }
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: "inherit",
    ...options,
  })

  if (result.error) throw result.error
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed with exit code ${result.status}`)
  }
}

function buildStaticArtifact(modelSlug) {
  console.log(`Building one static artifact for ${modelSlug}...`)
  run("pnpm", ["build:static"], {
    env: {
      ...process.env,
      NEXT_SCREENSHOT_BUILD: "1",
      NODE_OPTIONS: `${process.env.NODE_OPTIONS ?? ""} --max-old-space-size=2048`.trim(),
    },
  })

  validateStaticArtifact(modelSlug)
  writeFileSync(
    buildManifestPath,
    `${JSON.stringify({ schemaVersion: 1, modelSlug, showcaseIds }, null, 2)}\n`
  )
}

function validateStaticArtifact(modelSlug, requireManifest = false) {
  for (const showcaseId of showcaseIds) {
    const htmlPath = path.join(
      root,
      "out",
      "model-showcase",
      modelSlug,
      showcaseId,
      "index.html"
    )
    if (!existsSync(htmlPath)) {
      throw new Error(`Static build is missing ${path.relative(root, htmlPath)}`)
    }
    if (!readFileSync(htmlPath, "utf8").includes(modelNames.get(modelSlug))) {
      throw new Error(
        `Static build does not contain the expected model name ${modelNames.get(modelSlug)}`
      )
    }
  }

  if (requireManifest) {
    if (!existsSync(buildManifestPath)) {
      throw new Error("The static artifact has no screenshot build manifest and cannot be resumed")
    }
    const manifest = JSON.parse(readFileSync(buildManifestPath, "utf8"))
    if (
      manifest.schemaVersion !== 1 ||
      manifest.modelSlug !== modelSlug ||
      JSON.stringify(manifest.showcaseIds) !== JSON.stringify(showcaseIds)
    ) {
      throw new Error("The static artifact manifest does not match this capture request")
    }
  }
}

async function getAvailablePort() {
  const server = createServer()
  server.unref()
  await new Promise((resolve, reject) => {
    server.once("error", reject)
    server.listen(0, "127.0.0.1", resolve)
  })
  const address = server.address()
  const port = typeof address === "object" && address ? address.port : null
  await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())))
  if (!port) throw new Error("Could not reserve a local preview port")
  return port
}

async function waitForStaticServer(baseUrl, serverProcess) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (serverProcess.exitCode !== null) {
      throw new Error(`Static preview exited with code ${serverProcess.exitCode}`)
    }
    try {
      const response = await fetch(baseUrl)
      if (response.ok) return
    } catch {
      // The local server may still be starting.
    }
    await delay(100)
  }
  throw new Error(`Static preview did not become ready at ${baseUrl}`)
}

async function stopChild(child) {
  if (!child || child.exitCode !== null) return
  child.kill("SIGTERM")
  await Promise.race([once(child, "exit"), delay(5000)])
  if (child.exitCode === null) child.kill("SIGKILL")
}

async function captureModel(modelSlug, baseUrl, cwebpPath) {
  const { chromium } = await import("playwright")
  const browser = await chromium.launch({
    channel: "chromium",
    headless: true,
    args: ["--disable-background-networking", "--disable-gpu", "--no-first-run"],
  })

  try {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: "reduce",
    })
    const page = await context.newPage()

    try {
      for (const [index, showcaseId] of captureIds.entries()) {
        assertCapacity(minCaptureFreeBytes, minCaptureMemoryFreePercentWithBusyCumora)
        const response = await page.goto(
          `${baseUrl}/model-showcase/${modelSlug}/${showcaseId}/`,
          { waitUntil: "load", timeout: 60000 }
        )
        if (!response?.ok()) {
          throw new Error(`Failed to load ${showcaseId}: status ${response?.status()}`)
        }

        await page.evaluate(() => document.fonts.ready)
        await page.waitForTimeout(250)

        const outputDirectory = path.join(root, "public", "model-screenshots", modelSlug, showcaseId)
        const nextPngPath = path.join(outputDirectory, "desktop.next.png")
        const nextWebpPath = path.join(outputDirectory, "desktop.next.webp")
        const pngPath = path.join(outputDirectory, "desktop.png")
        const webpPath = path.join(outputDirectory, "desktop.webp")
        mkdirSync(outputDirectory, { recursive: true })

        await page.screenshot({ path: nextPngPath, type: "png" })
        execFileSync(
          cwebpPath,
          ["-quiet", "-q", "82", "-m", "6", "-metadata", "none", nextPngPath, "-o", nextWebpPath],
          { stdio: "inherit" }
        )
        renameSync(nextPngPath, pngPath)
        renameSync(nextWebpPath, webpPath)
        console.log(`[${index + 1}/${captureIds.length}] captured ${showcaseId}`)
      }
    } finally {
      await context.close()
    }
  } finally {
    await browser.close()
  }
}

function syncCapturedAssetsToStaticArtifact(modelSlug) {
  for (const showcaseId of showcaseIds) {
    const publicDirectory = path.join(root, "public", "model-screenshots", modelSlug, showcaseId)
    const staticDirectory = path.join(root, "out", "model-screenshots", modelSlug, showcaseId)
    mkdirSync(staticDirectory, { recursive: true })

    for (const assetName of ["desktop.png", "desktop.webp"]) {
      const sourcePath = path.join(publicDirectory, assetName)
      if (!existsSync(sourcePath)) {
        throw new Error(`Captured asset is missing ${path.relative(root, sourcePath)}`)
      }
      copyFileSync(sourcePath, path.join(staticDirectory, assetName))
    }
  }
}

const argumentsList = process.argv.slice(2).filter((argument) => argument !== "--")
const resumeStatic = argumentsList.includes("--resume-static")
const fromArgument = argumentsList.find((argument) => argument.startsWith("--from="))
const modelArgs = argumentsList.filter(
  (argument) => argument !== "--resume-static" && !argument.startsWith("--from=")
)
if (modelArgs.length !== 1 || !supportedModels.has(modelArgs[0])) {
  throw new Error(`Pass exactly one supported model slug: ${[...supportedModels].join(", ")}`)
}

const [modelSlug] = modelArgs
const fromShowcaseId = fromArgument?.slice("--from=".length)
if (fromShowcaseId && !showcaseIds.includes(fromShowcaseId)) {
  throw new Error(`Unknown --from showcase id: ${fromShowcaseId}`)
}
if (fromShowcaseId && !resumeStatic) {
  throw new Error("--from requires --resume-static so a partial run cannot silently use a new build")
}
const captureIds = fromShowcaseId
  ? showcaseIds.slice(showcaseIds.indexOf(fromShowcaseId))
  : showcaseIds

assertCapacity(
  resumeStatic ? minCaptureFreeBytes : minBuildFreeBytes,
  resumeStatic
    ? minCaptureMemoryFreePercentWithBusyCumora
    : minBuildMemoryFreePercentWithBusyCumora
)
assertNoExistingHeadlessBrowser()
const cwebpPath = execFileSync("/usr/bin/which", ["cwebp"], { encoding: "utf8" }).trim()
if (!cwebpPath) throw new Error("cwebp is required to create release WebP assets")

const lockFd = acquireCaptureLock()
let serverProcess

try {
  if (resumeStatic) {
    validateStaticArtifact(modelSlug, true)
    console.log(`Reusing the existing validated static artifact for ${modelSlug}.`)
  } else {
    buildStaticArtifact(modelSlug)
  }
  assertCapacity(minCaptureFreeBytes, minCaptureMemoryFreePercentWithBusyCumora)

  const port = await getAvailablePort()
  const baseUrl = `http://127.0.0.1:${port}`
  const serveBin = path.join(root, "node_modules", "serve", "build", "main.js")
  serverProcess = spawn(
    process.execPath,
    [serveBin, "out", "-l", `tcp://127.0.0.1:${port}`, "-n", "-L", "--no-port-switching"],
    { cwd: root, stdio: "inherit" }
  )
  await waitForStaticServer(baseUrl, serverProcess)
  await captureModel(modelSlug, baseUrl, cwebpPath)
  syncCapturedAssetsToStaticArtifact(modelSlug)
  run("pnpm", ["assets:screenshot-versions"])
  console.log(`Captured ${captureIds.length} screenshots from one static build for ${modelSlug}.`)
} finally {
  await stopChild(serverProcess)
  closeSync(lockFd)
  if (existsSync(captureLockPath)) unlinkSync(captureLockPath)
}
