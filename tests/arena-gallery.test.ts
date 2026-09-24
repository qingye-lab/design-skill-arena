import { describe, expect, it } from "vitest"
import { showcases } from "@/data/showcases"
import { skills } from "@/data/skills"
import { arenaHref, chainId, galleryItems, galleryPageSize, getChains, getModels, modelSlug, pageNumbers, parseArenaState } from "@/lib/arena-gallery"
import { chainContext, contributionContext, designIntent } from "@/lib/arena-context"
import { getPublicArenaSkills } from "@/lib/public-arena-skills"

const first = showcases[0]

function parse(query: string) { return parseArenaState(`/${query}`, showcases) }

describe("gallery grouping and fixed conditions", () => {
  it("keeps each skill chain together on a complete default page", () => {
    const state = { model: "all", chain: "all", query: "" }
    const ordered = galleryItems(showcases, state)
    const pageSize = galleryPageSize(showcases, state)
    const firstPage = ordered.slice(0, pageSize)
    const secondPage = ordered.slice(pageSize, pageSize * 2)

    expect(ordered).toEqual(showcases)
    expect(pageSize).toBe(getModels(showcases).length)
    expect(new Set(firstPage.map(chainId))).toEqual(new Set([chainId(firstPage[0])]))
    expect(firstPage.map(modelSlug)).toEqual(getModels(showcases).map(modelSlug))
    expect(new Set(secondPage.map(chainId))).toEqual(new Set([chainId(secondPage[0])]))
    expect(chainId(secondPage[0])).not.toBe(chainId(firstPage[0]))
  })
  it("uses the canonical chain order when a model is fixed, and the canonical model order when a chain is fixed", () => {
    const modelWorks = galleryItems(showcases, { model: modelSlug(first), chain: "all", query: "" })
    expect(modelWorks.map(chainId)).toEqual(getChains(showcases).map(chainId))
    const chainWorks = galleryItems(showcases, { model: "all", chain: chainId(first), query: "" })
    expect(chainWorks.map(modelSlug)).toEqual(getModels(showcases).map(modelSlug))
  })
  it("intersects both filters with a case-insensitive search, including the empty result path", () => {
    expect(galleryItems(showcases, { model: modelSlug(first), chain: chainId(first), query: first.model.toUpperCase() })).toEqual([first])
    expect(galleryItems(showcases, { model: modelSlug(first), chain: chainId(first), query: "a nonexistent chain 92874" })).toEqual([])
  })
})

describe("shareable arena state", () => {
  it("restores filters, locale, page, detail and device without depending on client storage", () => {
    const state = parse(`?model=${modelSlug(first)}&lang=en&item=${first.id}&device=mobile`)
    expect(state).toMatchObject({ model: modelSlug(first), locale: "en-US", item: first.id, device: "mobile", repaired: false })
    const restored = parseArenaState(arenaHref("/?utm_source=shared#collection-title", state), showcases)
    expect(restored).toEqual(state)
    expect(arenaHref("/?utm_source=shared#collection-title", state)).toContain("utm_source=shared")
    expect(arenaHref("/?utm_source=shared#collection-title", state)).toContain("#collection-title")
  })
  it("preserves spaces and punctuation while a search is being entered", () => {
    const state = parse("")
    const query = "GPT 6 + visual & "
    expect(parseArenaState(arenaHref("/", state, { query }), showcases).query).toBe(query)
  })
  it("repairs missing works, removed filters, and out-of-range pages while retaining valid values", () => {
    const filtered = { model: "all", chain: chainId(first), query: "" }
    const lastPage = Math.ceil(galleryItems(showcases, filtered).length / galleryPageSize(showcases, filtered))
    const state = parse(`?model=retired&chain=${filtered.chain}&page=999&item=removed`)
    expect(state).toMatchObject({ model: "all", chain: filtered.chain, page: lastPage, item: null, repaired: true })
    expect(parse("?page=-4").page).toBe(1)
    expect(parse("?page=NaN").page).toBe(1)
    expect(parse("?q=no-such-work&page=77").page).toBe(1)
    expect(parseArenaState(arenaHref("/", state), showcases).repaired).toBe(false)
  })
  it("keeps pagination bounded while retaining both ends and the current page", () => {
    for (const total of [1, 2, 7, 8, 13, 100]) for (let current = 1; current <= total; current++) {
      const pages = pageNumbers(current, total)
      expect(pages.length).toBeLessThanOrEqual(7)
      expect(pages).toContain(1)
      expect(pages).toContain(total)
      expect(pages).toContain(current)
      expect(new Set(pages).size).toBe(pages.length)
    }
  })

})

describe("public skill records and reusable context", () => {
  const sources = getPublicArenaSkills()
  it("publishes source and purpose without local installation details", () => {
    expect(sources).toHaveLength(skills.length)
    expect(sources.every((skill) => skill.summary && skill.summaryEn && skill.githubUrl)).toBe(true)
    expect(JSON.stringify(sources)).not.toMatch(/\/Users\/|localPath|installCommands|usageCommands|\"status\"/)
    expect(sources.find((skill) => skill.id === "frontend-skill")).toMatchObject({ historical: true })
    expect(sources.find((skill) => skill.id === "frontend-skill")?.revision).toMatch(/^[a-f0-9]{40}$/)
  })
  it("provides one-work context and distinguishes it from the complete 18-work contribution task", () => {
    for (const locale of ["zh-CN", "en-US"] as const) {
      const single = chainContext(first, locale, sources)
      expect(single).toContain(first.model)
      expect(single).toContain(first.skillChainLabel)
      expect(single).toContain(sources.find((skill) => skill.id === first.skills[0])!.githubUrl)
      expect(single).not.toContain("src/components/model-showcases")
      expect(single).not.toContain("/Users/")
      const contribution = contributionContext(locale)
      getChains(showcases).forEach((item) => expect(contribution).toContain(chainId(item)))
      expect(contribution).toContain("18")
      expect(showcases.every((item) => designIntent(item, locale).length > 0)).toBe(true)
    }
  })
})
