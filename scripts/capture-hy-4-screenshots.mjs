/**
 * Dedicated capture script for the Hy4 (hy-4) showcase contribution.
 *
 * Why this exists: the shared `scripts/capture-model-screenshots.mjs` asserts free
 * memory via `/bin/ps`, which is not permitted in some sandboxes (EPERM). This script
 * reproduces the same capture contract with the same Playwright settings:
 *
 *   desktop  1440 x 900, reducedMotion "reduce"  -> public/model-screenshots/hy-4/{id}/desktop.{png,webp}
 *   mobile    390 x 844, dsf 2, full page        -> output/verify/hy-4/{id}/mobile.png
 *
 * It also probes for horizontal overflow on both viewports and appends the result to
 * output/arena-capture-hy-4.log.
 *
 * Usage:
 *   node scripts/capture-hy-4-screenshots.mjs            # build the static export first
 *   SKIP_BUILD=1 node scripts/capture-hy-4-screenshots.mjs   # reuse an existing out/
 *
 * The static export must be produced with:
 *   NEXT_SCREENSHOT_BUILD=1 NODE_OPTIONS=--max-old-space-size=2048 pnpm build:static
 */
import { execFileSync, spawn } from "node:child_process"
import { once } from "node:events"
import { appendFileSync, existsSync, mkdirSync, readFileSync, renameSync } from "node:fs"
import { createServer } from "node:net"
import path from "node:path"
import { setTimeout as delay } from "node:timers/promises"

process.env.PLAYWRIGHT_BROWSERS_PATH ??= "0"

const root = path.resolve(import.meta.dirname, "..")
const modelSlug = "hy-4"
const modelName = "Hy4"

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

const logPath = path.join(root, "output", "arena-capture-hy-4.log")
function log(line) {
  mkdirSync(path.dirname(logPath), { recursive: true })
  const stamped = `${new Date().toISOString()} ${line}\n`
  appendFileSync(logPath, stamped)
  process.stdout.write(stamped)
}

if (process.env.SKIP_BUILD !== "1") {
  log("build: NEXT_SCREENSHOT_BUILD=1 NODE_OPTIONS=--max-old-space-size=2048 pnpm build:static")
  execFileSync("pnpm", ["build:static"], {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, NEXT_SCREENSHOT_BUILD: "1", NODE_OPTIONS: "--max-old-space-size=2048" },
  })
}

for (const showcaseId of showcaseIds) {
  const htmlPath = path.join(root, "out", "model-showcase", modelSlug, showcaseId, "index.html")
  if (!existsSync(htmlPath)) throw new Error(`Missing ${htmlPath}`)
  if (!readFileSync(htmlPath, "utf8").includes(modelName)) {
    throw new Error(`Static build is missing ${modelName} in ${showcaseId}`)
  }
}
log(`static artifact validated: ${showcaseIds.length} ${modelName} pages under out/model-showcase/${modelSlug}`)

const probe = createServer()
probe.unref()
await new Promise((resolve, reject) => {
  probe.once("error", reject)
  probe.listen(0, "127.0.0.1", resolve)
})
const port = probe.address().port
await new Promise((resolve, reject) => probe.close((error) => (error ? reject(error) : resolve())))
const baseUrl = `http://127.0.0.1:${port}`

const serverProcess = spawn(
  process.execPath,
  [
    path.join(root, "node_modules", "serve", "build", "main.js"),
    "out",
    "-l",
    `tcp://127.0.0.1:${port}`,
    "-n",
    "-L",
    "--no-port-switching",
  ],
  { cwd: root, stdio: "ignore" }
)

async function waitForServer() {
  for (let attempt = 0; attempt < 150; attempt += 1) {
    try {
      const response = await fetch(baseUrl)
      if (response.ok) return
    } catch {}
    await delay(100)
  }
  throw new Error("Static preview did not start")
}

const cwebpPath = execFileSync("/usr/bin/which", ["cwebp"], { encoding: "utf8" }).trim()
if (!cwebpPath) throw new Error("cwebp is required to create release WebP assets")

async function overflowOf(page) {
  return page.evaluate(() => {
    const element = document.documentElement
    return { scrollWidth: element.scrollWidth, clientWidth: element.clientWidth }
  })
}

try {
  await waitForServer()
  const { chromium } = await import(
    new URL("file:///Volumes/SUNSANG%201/Codex/design/node_modules/playwright/index.mjs").href
  )
  const browser = await chromium.launch({
    channel: "chromium",
    headless: true,
    args: ["--disable-background-networking", "--disable-gpu", "--no-first-run"],
  })

  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  })
  const desktopPage = await desktopContext.newPage()

  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
    deviceScaleFactor: 2,
  })
  const mobilePage = await mobileContext.newPage()

  let overflowProblems = 0

  for (const [index, showcaseId] of showcaseIds.entries()) {
    const url = `${baseUrl}/model-showcase/${modelSlug}/${showcaseId}/`

    const desktopResponse = await desktopPage.goto(url, { waitUntil: "load", timeout: 60000 })
    if (!desktopResponse?.ok()) {
      throw new Error(`Failed to load ${showcaseId}: status ${desktopResponse?.status()}`)
    }
    await desktopPage.evaluate(() => document.fonts.ready)
    await desktopPage.waitForTimeout(250)

    const targetDir = path.join(root, "public", "model-screenshots", modelSlug, showcaseId)
    mkdirSync(targetDir, { recursive: true })
    const nextPng = path.join(targetDir, "desktop.next.png")
    const nextWebp = path.join(targetDir, "desktop.next.webp")
    await desktopPage.screenshot({ path: nextPng, type: "png" })
    execFileSync(
      cwebpPath,
      ["-quiet", "-q", "82", "-m", "6", "-metadata", "none", nextPng, "-o", nextWebp],
      { stdio: "inherit" }
    )
    const desktopPng = path.join(targetDir, "desktop.png")
    const desktopWebp = path.join(targetDir, "desktop.webp")
    const hadPng = existsSync(desktopPng)
    renameSync(nextPng, desktopPng)
    renameSync(nextWebp, desktopWebp)

    const desktopOverflow = await overflowOf(desktopPage)
    if (desktopOverflow.scrollWidth > desktopOverflow.clientWidth) {
      overflowProblems += 1
      log(`OVERFLOW desktop ${showcaseId}: ${desktopOverflow.scrollWidth} > ${desktopOverflow.clientWidth}`)
    }

    const mobileResponse = await mobilePage.goto(url, { waitUntil: "load", timeout: 60000 })
    if (!mobileResponse?.ok()) throw new Error(`Failed to load mobile ${showcaseId}`)
    await mobilePage.evaluate(() => document.fonts.ready)
    await mobilePage.waitForTimeout(250)

    const verifyDir = path.join(root, "output", "verify", modelSlug, showcaseId)
    mkdirSync(verifyDir, { recursive: true })
    await mobilePage.screenshot({ path: path.join(verifyDir, "mobile.png"), fullPage: true })

    const mobileOverflow = await overflowOf(mobilePage)
    if (mobileOverflow.scrollWidth > mobileOverflow.clientWidth) {
      overflowProblems += 1
      log(`OVERFLOW mobile ${showcaseId}: ${mobileOverflow.scrollWidth} > ${mobileOverflow.clientWidth}`)
    }

    const healthy =
      desktopOverflow.scrollWidth <= desktopOverflow.clientWidth &&
      mobileOverflow.scrollWidth <= mobileOverflow.clientWidth

    log(
      `[${index + 1}/${showcaseIds.length}] ${showcaseId} ${hadPng ? "replace" : "new"} ` +
        `desktop=${desktopOverflow.scrollWidth}/${desktopOverflow.clientWidth} ` +
        `mobile=${mobileOverflow.scrollWidth}/${mobileOverflow.clientWidth} ` +
        `overflow=${healthy ? "none" : "DETECTED"}`
    )
  }

  await desktopContext.close()
  await mobileContext.close()
  await browser.close()

  log(
    `done: ${showcaseIds.length} desktop PNG + WebP pairs, ${showcaseIds.length} mobile verification shots, ` +
      `horizontal overflow problems: ${overflowProblems}`
  )
} finally {
  serverProcess.kill("SIGTERM")
  await Promise.race([once(serverProcess, "exit"), delay(5000)])
  if (serverProcess.exitCode === null) serverProcess.kill("SIGKILL")
}
