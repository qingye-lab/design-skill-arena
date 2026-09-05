import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("screenshot capture safety", () => {
  const captureSource = readFileSync(
    path.join(process.cwd(), "scripts/capture-model-screenshots.mjs"),
    "utf8"
  )

  it("builds once before reusing one browser page for sequential screenshots", () => {
    expect(captureSource.match(/chromium\.launch/g)).toHaveLength(1)
    expect(captureSource.match(/context\.newPage/g)).toHaveLength(1)
    expect(captureSource).not.toContain("Promise.all")
    expect(captureSource).toContain(
      "for (const [index, showcaseId] of captureIds.entries())"
    )
    expect(captureSource.lastIndexOf("buildStaticArtifact(modelSlug)")).toBeLessThan(
      captureSource.lastIndexOf("await captureModel(modelSlug, baseUrl, cwebpPath)")
    )
    expect(captureSource.lastIndexOf("await captureModel(modelSlug, baseUrl, cwebpPath)")).toBeLessThan(
      captureSource.lastIndexOf("syncCapturedAssetsToStaticArtifact(modelSlug)")
    )
  })

  it("limits screenshot builds to one Next.js worker", () => {
    const nextConfigSource = readFileSync(path.join(process.cwd(), "next.config.ts"), "utf8")

    expect(nextConfigSource).toContain('process.env.NEXT_SCREENSHOT_BUILD === "1"')
    expect(nextConfigSource).toContain("cpus: 1")
    expect(nextConfigSource).toContain("staticGenerationMaxConcurrency: 1")
  })

  it("requires extra free memory when Cumora is above its normal safety limit", () => {
    expect(captureSource).toContain("minBuildMemoryFreePercentWithBusyCumora = 45")
    expect(captureSource).toContain("minCaptureMemoryFreePercentWithBusyCumora = 35")
    expect(captureSource).toContain("memoryFreePercent < minBusyCumoraFreePercent")
    expect(captureSource).toContain("cumoraTreeRssKiB > maxCumoraTreeRssKiB")
  })
})
