import { describe, expect, it } from "vitest"
import { existsSync, readFileSync } from "node:fs"
import path from "node:path"

import { skills } from "@/data/skills"
import { allModels, showcases } from "@/data/showcases"
import { messages } from "@/i18n"

const expectedModels = [
  "GPT-5.5",
  "Qwen 3.7 Max",
  "Kimi 2.7 Code",
  "Gemini 3.1 Pro",
  "GPT 5.6 Sol",
  "Kimi K3",
  "Qwen 3.8 Max",
  "Ox",
  "DeepSeek V4 flash 0731",
  "GPT 6 Astra",
  "GLM 5.2",
  "Claude Opus 4.8",
  "Claude Opus 5",
  "Claude sonnet 5",
]
const newestModelsFirst = [
  "GPT 6 Astra",
  "Claude Opus 5",
  "Claude sonnet 5",
  "DeepSeek V4 flash 0731",
  "Ox",
  "Qwen 3.8 Max",
  "Kimi K3",
  "GPT 5.6 Sol",
  "Gemini 3.1 Pro",
  "Claude Opus 4.8",
  "GLM 5.2",
  "Kimi 2.7 Code",
  "Qwen 3.7 Max",
  "GPT-5.5",
]

describe("showcases", () => {
  it("keeps all model showcase collections", () => {
    expect(showcases).toHaveLength(expectedModels.length * 18)
  })

  it("keeps 18 showcases per model", () => {
    expect(new Set(showcases.map((item) => item.model))).toEqual(new Set(expectedModels))
    expectedModels.forEach((model) => {
      expect(showcases.filter((item) => item.model === model)).toHaveLength(18)
    })
  })

  it("has stable unique ids", () => {
    const ids = showcases.map((item) => item.id)

    expect(new Set(ids).size).toBe(ids.length)
  })

  it("orders filters and gallery by newest models within each skill chain", () => {
    expect(allModels).toEqual(newestModelsFirst)
    expect(showcases.slice(0, expectedModels.length).map((item) => item.title)).toEqual(
      expectedModels.map(() => "Standard Builder")
    )
    expect(showcases.slice(0, expectedModels.length).map((item) => item.model)).toEqual(newestModelsFirst)
    expect(showcases.slice(expectedModels.length, expectedModels.length * 2).map((item) => item.title)).toEqual(
      expectedModels.map(() => "Visual Frontend")
    )
  })

  it("points gallery covers to existing compressed images", () => {
    showcases.forEach((item) => {
      const [screenshotPath, query] = item.screenshots.desktop.split("?")

      expect(screenshotPath.endsWith(".webp")).toBe(true)
      expect(query).toMatch(/^v=[0-9a-f]{12}$/)
      expect(existsSync(path.join(process.cwd(), "public", screenshotPath.replace(/^\/+/, "")))).toBe(true)
    })
  })

  it("allows voting for every registered model slug", () => {
    const votesSource = readFileSync(path.join(process.cwd(), "functions/api/votes.js"), "utf8")
    const modelSlugs = new Set(
      showcases.map((item) => {
        const sourceId = item.sourceUrl ?? item.id

        return item.id.endsWith(`-${sourceId}`) ? item.id.slice(0, -(sourceId.length + 1)) : item.id
      })
    )

    modelSlugs.forEach((slug) => {
      expect(votesSource).toContain(`"${slug}"`)
    })
  })

  it("keeps homepage actions and skill summaries localized", () => {
    expect(messages["en-US"].common.prompt).toBe("View prompt")
    expect(messages["en-US"].common.skillsSummary).toBe("Skills summary")
    expect(messages["en-US"].common.copyPrompt).toBe("Copy prompt")
    expect(skills.every((skill) => skill.summaryEn?.trim())).toBe(true)
  })
})
