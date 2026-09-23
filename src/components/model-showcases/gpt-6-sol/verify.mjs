import { spawn, execFileSync } from "node:child_process";
import { once } from "node:events";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createServer } from "node:net";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { chromium } from "playwright";

const root = process.cwd();
const ids = ["standard-builder", "visual-frontend", "design-logic", "impeccable-full-flow", "artifact-builder", "ux-pro-reference", "component-system", "motion-bits", "standard-taste", "standard-impeccable", "visual-taste", "visual-impeccable", "design-ux-pro", "design-impeccable", "balanced-chain", "visual-premium-chain", "product-polish-chain", "max-quality-chain"];
const report = { generatedAt: new Date().toISOString(), model: "GPT-6 Sol", modelId: "gpt-6-sol", pages: [] };
const profile = path.join("/tmp", `muse-gpt-6-sol-playwright-${process.pid}`);
const portServer = createServer();
await new Promise((resolve) => portServer.listen(0, "127.0.0.1", resolve));
const port = portServer.address().port;
await new Promise((resolve) => portServer.close(resolve));
const base = `http://127.0.0.1:${port}`;
const serve = spawn(process.execPath, [path.join(root, "node_modules/serve/build/main.js"), "out", "-l", `tcp://127.0.0.1:${port}`, "-n", "-L", "--no-port-switching"], { cwd: root, stdio: "ignore" });
console.log(`QA owner pid=${process.pid}; static server pid=${serve.pid}; browser profile=${profile}`);

let context;
try {
  for (let attempt = 0; attempt < 80; attempt++) {
    try { if ((await fetch(base)).ok) break; } catch { /* startup */ }
    if (serve.exitCode !== null) throw new Error(`Static server exited: ${serve.exitCode}`);
    await delay(100);
  }
  context = await chromium.launchPersistentContext(profile, { channel: "chromium", headless: true, viewport: { width: 1440, height: 900 }, reducedMotion: "reduce", args: ["--disable-background-networking", "--no-first-run"] });
  const page = context.pages()[0] ?? await context.newPage();
  for (const id of ids) {
    const failures = [];
    const onError = (error) => failures.push(error.message);
    const onConsole = (message) => { if (message.type() === "error") failures.push(message.text()); };
    page.on("pageerror", onError);
    page.on("console", onConsole);
    const url = `${base}/model-showcase/gpt-6-sol/${id}/`;
    await page.setViewportSize({ width: 1440, height: 900 });
    const response = await page.goto(url, { waitUntil: "load", timeout: 60000 });
    if (response?.status() !== 200) throw new Error(`${id}: HTTP ${response?.status()}`);
    await page.evaluate(() => localStorage.removeItem("muse-gpt-6-sol-campaigns"));
    await page.reload({ waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(100);
    const output = path.join(root, "public/model-screenshots/gpt-6-sol", id);
    await mkdir(output, { recursive: true });
    await page.screenshot({ path: path.join(output, "desktop.png"), animations: "disabled" });
    execFileSync("cwebp", ["-quiet", "-q", "82", "-m", "6", "-metadata", "none", path.join(output, "desktop.png"), "-o", path.join(output, "desktop.webp")]);
    const desktop = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }));
    const identity = await page.getByText("GPT-6 Sol", { exact: true }).count();
    const variants = page.locator('[aria-label="Campaign directions"] button');
    const directions = await variants.count();
    const controls = await page.locator("select").count();
    const text = await page.locator("main").innerText();
    if (identity !== 1 || directions !== 3 || controls !== 4 || await page.getByRole("heading", { level: 1 }).count() < 1 || await page.getByRole("combobox", { name: "Tone" }).count() !== 1 || !text.includes("Recent campaigns") || !text.includes("Conversion")) throw new Error(`${id}: missing shared requirement`);
    await variants.nth(1).click();
    if (await variants.nth(1).getAttribute("aria-pressed") !== "true") throw new Error(`${id}: direction B did not select`);
    await page.getByRole("button", { name: "Generate" }).click();
    await page.getByRole("status").getByText("Three directions are ready.", { exact: false }).waitFor({ timeout: 5000 });
    if (id === ids[0]) {
      await page.locator("select").nth(2).selectOption("Warm");
      await page.locator("select").nth(3).selectOption("Graphic");
      if (!await page.getByText("A little light, wherever you are.").count()) throw new Error("Tone did not update creative copy");
      if (await page.locator('[data-style="Graphic"]').count() !== 1) throw new Error("Visual style did not update creative treatment");
      await page.locator("textarea").fill("short");
      await page.getByRole("button", { name: "Generate" }).click();
      if (await page.locator('[data-status="error"]').count() !== 1) throw new Error("Invalid brief did not show error");
      await page.locator("textarea").fill("Launch Luma One to creative city dwellers with a flexible, warm campaign.");
      await page.getByRole("button", { name: "Save" }).click();
      if (!await page.getByText("Direction A saved to recent campaigns.").count()) throw new Error("Save did not confirm");
      await page.reload({ waitUntil: "load" });
      const saved = page.getByRole("button", { name: "Open Luma One · direction A" });
      await saved.waitFor({ timeout: 5000 });
      await page.locator("textarea").fill("A different campaign brief which should disappear after reopening the saved work.");
      await page.getByRole("combobox", { name: "Tone" }).selectOption("Confident");
      await page.getByRole("combobox", { name: "Visual style" }).selectOption("Editorial");
      await saved.click();
      if (await page.locator("textarea").inputValue() !== "Launch Luma One to creative city dwellers with a flexible, warm campaign." || await page.getByRole("combobox", { name: "Tone" }).inputValue() !== "Warm" || await page.getByRole("combobox", { name: "Visual style" }).inputValue() !== "Graphic" || await page.locator('[data-style="Graphic"]').count() !== 1) throw new Error("Recent campaign did not restore the saved studio state");
      const download = page.waitForEvent("download");
      await page.getByRole("button", { name: "Export" }).click();
      const file = await download;
      if (!file.suggestedFilename().endsWith(".json")) throw new Error("Export did not download JSON");
      const payload = JSON.parse(await readFile(await file.path(), "utf8"));
      if (payload.brief !== "Launch Luma One to creative city dwellers with a flexible, warm campaign." || payload.selectedCreative.headline !== "A little light, wherever you are." || payload.selectedCreative.body !== "Launch Luma One to creative city dwellers with a flexible, warm campaign" || payload.tone !== "Warm" || payload.visualStyle !== "Graphic" || payload.selected !== "A") throw new Error("Export did not contain the displayed saved creative");
      await page.keyboard.press("Shift+Tab");
      const outline = await page.locator(":focus").evaluate((button) => getComputedStyle(button).outlineStyle);
      if (outline === "none") throw new Error("Focus state is not visible");
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(url, { waitUntil: "load", timeout: 60000 });
    await page.evaluate(() => localStorage.removeItem("muse-gpt-6-sol-campaigns"));
    await page.reload({ waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(100);
    await page.screenshot({ path: path.join(output, "mobile.png"), animations: "disabled", fullPage: true });
    const mobile = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }));
    await page.locator('[aria-label="Campaign directions"] button').nth(2).click();
    if (await page.locator('[aria-label="Campaign directions"] button').nth(2).getAttribute("aria-pressed") !== "true") throw new Error(`${id}: mobile direction C did not select`);
    page.off("pageerror", onError);
    page.off("console", onConsole);
    const result = { id, url: `/model-showcase/gpt-6-sol/${id}`, desktop, mobile, runtimeErrors: failures };
    report.pages.push(result);
    console.log(`${id}: desktop overflow ${desktop.scrollWidth - desktop.width}px; mobile overflow ${mobile.scrollWidth - mobile.width}px; errors ${failures.length}`);
  }
  await writeFile(path.join(root, "src/components/model-showcases/gpt-6-sol/verification.json"), JSON.stringify(report, null, 2) + "\n");
  if (report.pages.some((item) => item.desktop.scrollWidth > item.desktop.width + 1 || item.mobile.scrollWidth > item.mobile.width + 1 || item.runtimeErrors.length)) process.exitCode = 1;
} finally {
  if (context) await context.close();
  if (serve.exitCode === null) {
    serve.kill("SIGTERM");
    await Promise.race([once(serve, "exit"), delay(5000)]);
    if (serve.exitCode === null) serve.kill("SIGKILL");
  }
  const running = execFileSync("ps", ["-axo", "pid=,command="], { encoding: "utf8" }).split("\n").filter((line) => line.includes(profile) && !line.includes("gpt-6-sol/verify.mjs"));
  console.log(`Owned browser processes remaining: ${running.length}`);
  if (running.length) process.exitCode = 1;
}
