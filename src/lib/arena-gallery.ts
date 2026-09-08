import type { ShowcaseItem } from "@/types/showcase"

export type ArenaLocale = "zh-CN" | "en-US"
export type PreviewDevice = "desktop" | "mobile"

export type ArenaState = {
  locale: ArenaLocale
  model: string
  chain: string
  query: string
  page: number
  item: string | null
  device: PreviewDevice | null
  repaired: boolean
}

export const GALLERY_PAGE_SIZE = 18

export function chainId(item: ShowcaseItem) {
  return item.sourceUrl ?? item.id
}

export function modelSlug(item: ShowcaseItem) {
  return item.demoUrl.split("/")[2] || item.model
}

export function getChains(items: ShowcaseItem[]) {
  return Array.from(new Map(items.map((item) => [chainId(item), item])).values())
}

export function getModels(items: ShowcaseItem[]) {
  return Array.from(new Map(items.map((item) => [modelSlug(item), item])).values())
}

/** An editorial browsing order. Every registered work appears exactly once. */
export function explorationOrder(items: ShowcaseItem[]) {
  const models = getModels(items)
  const chains = getChains(items)
  if (!chains.length) return []
  const byPair = new Map(items.map((item) => [`${modelSlug(item)}:${chainId(item)}`, item]))
  const result: ShowcaseItem[] = []
  const seen = new Set<string>()
  for (let round = 0; round < chains.length; round++) {
    models.forEach((model, index) => {
      const chain = chains[(round + index * 5) % chains.length]
      const item = byPair.get(`${modelSlug(model)}:${chainId(chain)}`)
      if (item && !seen.has(item.id)) {
        result.push(item)
        seen.add(item.id)
      }
    })
  }
  return [...result, ...items.filter((item) => !seen.has(item.id))]
}

export function galleryItems(
  items: ShowcaseItem[],
  state: Pick<ArenaState, "model" | "chain" | "query">
) {
  const ordered = state.model === "all" && state.chain === "all" ? explorationOrder(items) : items
  const query = state.query.trim().toLocaleLowerCase()
  return ordered.filter((item) =>
    (state.model === "all" || modelSlug(item) === state.model) &&
    (state.chain === "all" || chainId(item) === state.chain) &&
    (!query || [item.model, item.title, item.skillChainLabel, item.focus, ...item.tags]
      .join(" ").toLocaleLowerCase().includes(query))
  )
}

export function parseArenaState(href: string, items: ShowcaseItem[]): ArenaState {
  const url = new URL(href, "https://arena.invalid")
  const params = url.searchParams
  const models = new Set(items.map(modelSlug))
  const chains = new Set(items.map(chainId))
  const byId = new Map(items.map((item) => [item.id, item]))
  const rawModel = params.get("model") || "all"
  const rawChain = params.get("chain") || "all"
  const model = models.has(rawModel) ? rawModel : "all"
  const chain = chains.has(rawChain) ? rawChain : "all"
  const rawItem = params.get("item")
  const rawPage = params.get("page") || "1"
  const requestedPage = /^\d+$/.test(rawPage) ? Number(rawPage) : 1
  const query = (params.get("q") || "").slice(0, 160)
  const pageCount = Math.max(1, Math.ceil(galleryItems(items, { model, chain, query }).length / GALLERY_PAGE_SIZE))
  const page = Math.max(1, Math.min(Number.isSafeInteger(requestedPage) ? requestedPage : 1, pageCount))
  const device = params.get("device")
  return {
    locale: params.get("lang") === "en" ? "en-US" : "zh-CN",
    model, chain, query, page,
    item: rawItem && byId.has(rawItem) ? rawItem : null,
    device: device === "mobile" || device === "desktop" ? device : null,
    repaired: (rawModel !== "all" && model === "all") ||
      (rawChain !== "all" && chain === "all") ||
      Boolean(rawItem && !byId.has(rawItem)) ||
      rawPage !== String(page),
  }
}

export function arenaHref(href: string, state: ArenaState, patch: Partial<ArenaState> = {}) {
  const url = new URL(href, "https://arena.invalid")
  const next = { ...state, ...patch }
  const values: Record<string, string | null> = {
    lang: next.locale === "en-US" ? "en" : null,
    model: next.model === "all" ? null : next.model,
    chain: next.chain === "all" ? null : next.chain,
    q: next.query || null,
    page: next.page > 1 ? String(next.page) : null,
    view: null, axis: null, compare: null,
    item: next.item,
    device: next.device,
  }
  for (const [key, value] of Object.entries(values)) {
    if (value === null) url.searchParams.delete(key)
    else url.searchParams.set(key, value)
  }
  return `${url.pathname}${url.search}${url.hash}`
}

export function pageNumbers(page: number, total: number): (number | "gap-left" | "gap-right")[] {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1)
  const from = Math.max(2, Math.min(page - 1, total - 4))
  const to = Math.min(total - 1, Math.max(page + 1, 5))
  return [1, ...(from > 2 ? ["gap-left" as const] : []),
    ...Array.from({ length: to - from + 1 }, (_, index) => from + index),
    ...(to < total - 1 ? ["gap-right" as const] : []), total]
}
