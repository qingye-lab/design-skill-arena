import { execFileSync, spawn } from "node:child_process"
import { existsSync, mkdirSync, renameSync, readFileSync, rmSync } from "node:fs"
import { createServer } from "node:net"
import path from "node:path"
import { setTimeout as delay } from "node:timers/promises"
import { fileURLToPath } from "node:url"

// Standalone capture for the DeepSeek V4.1 flash contribution.
// It never rewrites the shared showcase registry: it only reads the exported
// static artifact and writes the model's own screenshot folder.
process.env.PLAYWRIGHT_BROWSERS_PATH ??= "0"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const modelSlug = "deepseek-v4.1-flash"
const modelName = "DeepSeek V4.1 flash"
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

const desktopViewport = { width: 1440, height: 900 }
const mobileViewport = { width: 390, height: 844 }
const verifyRoot = path.join(root, "output", "verify", modelSlug)

function fail(message) {
  console.error(`error: ${message}`)
  process.exit(1)
}

function assertStaticArtifact() {
  const missing = []
  for (const showcaseId of showcaseIds) {
    const htmlPath = path.join(root, "out", "model-showcase", modelSlug, showcaseId, "index.html")
    if (!existsSync(htmlPath)) {
      missing.push(path.relative(root, htmlPath))
      continue
    }
    if (!readFileSync(htmlPath, "utf8").includes(modelName)) {
      fail(`expected ${modelName} inside ${path.relative(root, htmlPath)}`)
    }
  }
  if (missing.length > 0) {
    fail(`static export is missing ${missing.length} page(s): ${missing.join(", ")}`)
  }
  console.log(`validated ${showcaseIds.length} static pages for ${modelSlug}`)
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
  if (!port) fail("could not reserve a local preview port")
  return port
}

async function waitForServer(baseUrl, child) {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    if (child.exitCode !== null) fail(`static preview exited with code ${child.exitCode}`)
    try {
      const response = await fetch(baseUrl)
      if (response.ok) return
    } catch {
      // still starting
    }
    await delay(100)
  }
  fail(`static preview did not become ready at ${baseUrl}`)
}

async function stopChild(child) {
  if (!child || child.exitCode !== null) return
  child.kill("SIGTERM")
  await delay(800)
  if (child.exitCode === null) child.kill("SIGKILL")
}

async function launchChromium(chromium) {
  const launchArgs = ["--disable-background-networking", "--disable-gpu", "--no-first-run"]
  try {
    return await chromium.launch({ channel: "chromium", headless: true, args: launchArgs })
  } catch (error) {
    const candidates = [
      path.join(
        process.env.HOME ?? "",
        "Library/Caches/ms-playwright/chromium-1194/chrome-mac/Chromium.app/Contents/MacOS/Chromium"
      ),
      path.join(
        process.env.HOME ?? "",
        "Library/Caches/ms-playwright/chromium_headless_shell-1194/chrome-mac/headless_shell"
      ),
    ]
    for (const executablePath of candidates) {
      if (!existsSync(executablePath)) continue
      console.log(`falling back to cached Chromium at ${executablePath}`)
      return await chromium.launch({ executablePath, headless: true, args: launchArgs })
    }
    throw error
  }
}

async function capture(baseUrl, cwebpPath) {
  const { chromium } = await import("playwright")
  const browser = await launchChromium(chromium)

  const evidence = []

  try {
    const desktopContext = await browser.newContext({ viewport: desktopViewport, reducedMotion: "reduce" })
    const desktopPage = await desktopContext.newPage()
    const mobileContext = await browser.newContext({
      viewport: mobileViewport,
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
      reducedMotion: "reduce",
    })
    const mobilePage = await mobileContext.newPage()

    try {
      for (const [index, showcaseId] of showcaseIds.entries()) {
        const url = `${baseUrl}/model-showcase/${modelSlug}/${showcaseId}/`

        const response = await desktopPage.goto(url, { waitUntil: "load", timeout: 60000 })
        if (!response?.ok()) fail(`failed to load ${showcaseId}: status ${response?.status()}`)
        await desktopPage.evaluate(() => document.fonts.ready)
        await desktopPage.waitForTimeout(300)

        const outputDirectory = path.join(root, "public", "model-screenshots", modelSlug, showcaseId)
        mkdirSync(outputDirectory, { recursive: true })
        const nextPng = path.join(outputDirectory, "desktop.next.png")
        const nextWebp = path.join(outputDirectory, "desktop.next.webp")
        await desktopPage.screenshot({ path: nextPng, type: "png" })
        execFileSync(cwebpPath, ["-quiet", "-q", "82", "-m", "6", "-metadata", "none", nextPng, "-o", nextWebp], {
          stdio: "inherit",
        })
        renameSync(nextPng, path.join(outputDirectory, "desktop.png"))
        renameSync(nextWebp, path.join(outputDirectory, "desktop.webp"))

        const desktopScrollWidth = await desktopPage.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }))

        const mobileResponse = await mobilePage.goto(url, { waitUntil: "load", timeout: 60000 })
        if (!mobileResponse?.ok()) fail(`failed mobile load for ${showcaseId}: status ${mobileResponse?.status()}`)
        await mobilePage.evaluate(() => document.fonts.ready)
        await mobilePage.waitForTimeout(300)
        const mobileDirectory = path.join(verifyRoot, showcaseId)
        mkdirSync(mobileDirectory, { recursive: true })
        const mobileShot = path.join(mobileDirectory, "mobile.png")
        await mobilePage.screenshot({ path: mobileShot, type: "png", fullPage: true })
        const mobileScrollWidth = await mobilePage.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }))

        evidence.push({
          showcaseId,
          url,
          desktopOverflow: desktopScrollWidth.scrollWidth > desktopScrollWidth.clientWidth + 1,
          mobileOverflow: mobileScrollWidth.scrollWidth > mobileScrollWidth.clientWidth + 1,
        })

        const flags = []
        if (desktopScrollWidth.scrollWidth > desktopScrollWidth.clientWidth + 1) flags.push("desktop-overflow")
        if (mobileScrollWidth.scrollWidth > mobileScrollWidth.clientWidth + 1) flags.push("mobile-overflow")
        console.log(
          `[${index + 1}/${showcaseIds.length}] captured ${showcaseId}${flags.length ? ` (${flags.join(", ")})` : ""}`
        )
      }
    } finally {
      await desktopContext.close()
      await mobileContext.close()
    }
  } finally {
    await browser.close()
  }

  return evidence
}

const argumentsList = process.argv.slice(2)
const skipServe = argumentsList.includes("--base-url")
const baseUrlArgument = argumentsList.find((argument) => argument.startsWith("--base-url="))?.slice("--base-url=".length)

const cwebpPath = execFileSync("/usr/bin/which", ["cwebp"], { encoding: "utf8" }).trim()
if (!cwebpPath) fail("cwebp is required to create release WebP assets")

assertStaticArtifact()
if (existsSync(verifyRoot)) rmSync(verifyRoot, { recursive: true, force: true })

let serverProcess
let baseUrl = baseUrlArgument

try {
  if (!skipServe) {
    const port = await getAvailablePort()
    baseUrl = `http://127.0.0.1:${port}`
    const serveBin = path.join(root, "node_modules", "serve", "build", "main.js")
    serverProcess = spawn(
      process.execPath,
      [serveBin, "out", "-l", `tcp://127.0.0.1:${port}`, "-n", "-L", "--no-port-switching"],
      { cwd: root, stdio: "inherit" }
    )
    await waitForServer(baseUrl, serverProcess)
  }

  const evidence = await capture(baseUrl, cwebpPath)
  const problems = evidence.filter((item) => item.desktopOverflow || item.mobileOverflow)
  console.log(`\ncaptured ${evidence.length} desktop pairs + ${evidence.length} mobile verification shots`)
  console.log(`horizontal overflow: ${problems.length === 0 ? "none" : problems.map((p) => p.showcaseId).join(", ")}`)
} finally {
  await stopChild(serverProcess)
}
