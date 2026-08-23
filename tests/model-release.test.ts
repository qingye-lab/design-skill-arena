import { createHash } from "node:crypto"
import { readFileSync, readdirSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

import { onRequestGet, onRequestPost } from "../functions/api/votes.js"
import {
  MODEL_NAME as DEEPSEEK_MODEL_NAME,
  isDeepseekV4FlashShowcaseId,
  showcaseComponents as deepseekComponents,
  showcaseIds as deepseekIds,
} from "@/components/model-showcases/deepseek-v4-flash"
import {
  MODEL_NAME as OX_MODEL_NAME,
  isOxShowcaseId,
  showcaseComponents as oxComponents,
  showcaseIds as oxIds,
} from "@/components/model-showcases/ox"
import {
  generateMetadata as generateDeepseekMetadata,
  generateStaticParams as generateDeepseekStaticParams,
} from "@/app/model-showcase/deepseek-v4-flash/[showcaseId]/page"
import {
  generateMetadata as generateOxMetadata,
  generateStaticParams as generateOxStaticParams,
} from "@/app/model-showcase/ox/[showcaseId]/page"
import { showcases } from "@/data/showcases"

describe("model release routes", () => {
  it("registers all 18 Ox and DeepSeek pages with matching components", () => {
    expect(OX_MODEL_NAME).toBe("Ox")
    expect(DEEPSEEK_MODEL_NAME).toBe("DeepSeek V4 flash 0731")
    expect(generateOxStaticParams()).toEqual(oxIds.map((showcaseId) => ({ showcaseId })))
    expect(generateDeepseekStaticParams()).toEqual(
      deepseekIds.map((showcaseId) => ({ showcaseId }))
    )
    expect(Object.keys(oxComponents)).toEqual(oxIds)
    expect(Object.keys(deepseekComponents)).toEqual(deepseekIds)
    expect(isOxShowcaseId("standard-builder")).toBe(true)
    expect(isOxShowcaseId("unknown")).toBe(false)
    expect(isDeepseekV4FlashShowcaseId("standard-builder")).toBe(true)
    expect(isDeepseekV4FlashShowcaseId("unknown")).toBe(false)
  })

  it("uses the full release names in page metadata", async () => {
    await expect(
      generateOxMetadata({ params: Promise.resolve({ showcaseId: "standard-builder" }) })
    ).resolves.toEqual({ title: "Ox Standard Builder | Muse Showcase" })
    await expect(
      generateDeepseekMetadata({
        params: Promise.resolve({ showcaseId: "standard-builder" }),
      })
    ).resolves.toEqual({ title: "DeepSeek V4 flash 0731 Standard Builder | Muse Showcase" })
    await expect(
      generateDeepseekMetadata({ params: Promise.resolve({ showcaseId: "unknown" }) })
    ).resolves.toEqual({ title: "Muse Showcase" })
  })

  it("keeps the full DeepSeek name visible in every generated page component", () => {
    const componentDirectory = path.join(
      process.cwd(),
      "src/components/model-showcases/deepseek-v4-flash"
    )
    const pageFiles = readdirSync(componentDirectory).filter(
      (fileName) => fileName.endsWith(".tsx") && fileName !== "index.tsx"
    )

    expect(pageFiles).toHaveLength(18)
    pageFiles.forEach((fileName) => {
      expect(readFileSync(path.join(componentDirectory, fileName), "utf8")).toContain(
        "DeepSeek V4 flash 0731"
      )
    })
  })
})

describe("model release assets", () => {
  it("uses the actual WebP content hash as the gallery cache version", () => {
    showcases
      .filter((item) => item.model === OX_MODEL_NAME || item.model === DEEPSEEK_MODEL_NAME)
      .forEach((item) => {
        const [screenshotPath, query] = item.screenshots.desktop.split("?")
        const bytes = readFileSync(
          path.join(process.cwd(), "public", screenshotPath.replace(/^\/+/, ""))
        )
        const digest = createHash("sha256").update(bytes).digest("hex").slice(0, 12)

        expect(query).toBe(`v=${digest}`)
      })
  })
})

function createVotesDb() {
  return {
    prepare(sql: string) {
      return {
        bind(...params: string[]) {
          return {
            async all() {
              if (sql.includes("GROUP BY target_id")) {
                return { results: params.map((targetId) => ({ target_id: targetId, count: 1 })) }
              }
              return { results: [] }
            },
            async first() {
              if (sql.includes("vote_rate_limits")) return null
              if (sql.includes("COUNT(*)")) return { count: 1 }
              return null
            },
            async run() {
              return { success: true }
            },
          }
        },
      }
    },
  }
}

describe("model release voting", () => {
  it("accepts Ox and DeepSeek targets and filters unknown targets", async () => {
    const db = createVotesDb()
    const response = await onRequestGet({
      env: { VOTES_DB: db },
      request: new Request(
        "https://arena.example/api/votes?ids=ox-standard-builder,deepseek-v4-flash-standard-builder,unknown-standard-builder"
      ),
    })

    await expect(response.json()).resolves.toEqual({
      enabled: false,
      counts: {
        "ox-standard-builder": 1,
        "deepseek-v4-flash-standard-builder": 1,
      },
      voted: [],
    })
  })

  it("records a valid DeepSeek vote and rejects an unknown model", async () => {
    const env = { VOTES_DB: createVotesDb(), VOTE_HASH_SALT: "test-salt" }
    const validResponse = await onRequestPost({
      env,
      request: new Request("https://arena.example/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetId: "deepseek-v4-flash-standard-builder" }),
      }),
    })
    const invalidResponse = await onRequestPost({
      env,
      request: new Request("https://arena.example/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetId: "unknown-standard-builder" }),
      }),
    })

    expect(validResponse.status).toBe(200)
    await expect(validResponse.json()).resolves.toEqual({
      targetId: "deepseek-v4-flash-standard-builder",
      count: 1,
      voted: true,
    })
    expect(invalidResponse.status).toBe(400)
    await expect(invalidResponse.json()).resolves.toEqual({ error: "Invalid target." })
  })
})
