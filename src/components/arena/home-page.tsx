"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { useMemo, useRef, useState } from "react"
import { ArrowUpRight, ChevronLeft, ChevronRight, Search, SlidersHorizontal, X } from "lucide-react"
import { showcases } from "@/data/showcases"
import { arenaHref, chainId, galleryItems, GALLERY_PAGE_SIZE, getChains, getModels, modelSlug, pageNumbers, type ArenaState } from "@/lib/arena-gallery"
import type { PublicArenaSkill } from "@/lib/public-arena-skills"
import { assetUrl } from "@/lib/assets"
import { arenaCopy } from "./arena-copy"
import { ArenaShell, localeHref } from "./arena-shell"
import { SearchFilter } from "./arena-controls"
import { ShowcaseCard } from "./showcase-card"
import { useArenaLocation } from "./use-arena-location"
import { useArenaVotes } from "./use-arena-votes"
import styles from "./arena.module.css"

const WorkDetail = dynamic(() => import("./work-detail"))
const models = getModels(showcases)
const chains = getChains(showcases)
const heroWorks = models.slice(0, 3)

export function HomePage({ sources }: { sources: PublicArenaSkill[] }) {
  const { state, update } = useArenaLocation()
  const text = arenaCopy(state.locale)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [dismissedRepair, setDismissedRepair] = useState(false)
  const collectionRef = useRef<HTMLHeadingElement>(null)
  const filtered = useMemo(() => galleryItems(showcases, state), [state])
  const pageCount = Math.max(1, Math.ceil(filtered.length / GALLERY_PAGE_SIZE))
  const pageItems = filtered.slice((state.page - 1) * GALLERY_PAGE_SIZE, state.page * GALLERY_PAGE_SIZE)
  const selectedItem = showcases.find((item) => item.id === state.item)
  const votes = useArenaVotes(pageItems.map((item) => item.id))
  const activeFilters = state.model !== "all" || state.chain !== "all" || Boolean(state.query)
  function filter(patch: Partial<ArenaState>, replace = false) { update({ ...patch, page: 1, item: null }, replace) }
  function clear() { filter({ model: "all", chain: "all", query: "" }) }
  function open(id: string) { update({ item: id }) }
  function paginate(page: number) {
    update({ page })
    requestAnimationFrame(() => { collectionRef.current?.scrollIntoView({ block: "start" }); collectionRef.current?.focus({ preventScroll: true }) })
  }
  return <ArenaShell locale={state.locale} onLocaleChange={(locale) => update({ locale })} current="works" collectionHref={arenaHref("/", state, { item: null })}>
    <main id="main-content">
      {state.repaired && !dismissedRepair && <div className={styles.notice} role="status"><span>{text.shareRepair}</span><button className={styles.iconButton} aria-label={text.dismiss} onClick={() => { setDismissedRepair(true); update({}, true) }}><X size={16} /></button></div>}
        <section className={styles.intro}>
          <div className={styles.introContent}><div className={styles.eyebrow}><span className={styles.editionDot} />{models.length} {text.modelsCount} / {chains.length} {text.chainsCount}</div><h1><span>{text.headline[0]}</span><span>{text.headline[1]}</span></h1><Link href={localeHref("/methodology/#brief", state.locale)} className={styles.briefLink}><span className={styles.small}>{text.brief}</span><strong>{text.briefName}</strong><ArrowUpRight size={15} /></Link></div>
          <div className={styles.heroComposition}>
            <span className={styles.heroRegistration} aria-hidden="true">+</span>
            {heroWorks.map((item, index) => <button key={item.id} className={styles.heroPrint} onClick={() => open(item.id)} aria-label={`${text.viewWork}: ${item.model} · ${item.title}`}>
              <span className={styles.heroPrintLabel}><span>0{index + 1}</span>{item.model}<ArrowUpRight size={11} /></span>
              {/* eslint-disable-next-line @next/next/no-img-element -- The opening composition reuses real collection captures. */}
              <img src={assetUrl(item.screenshots.desktop)} alt="" decoding="async" />
            </button>)}
            <span className={styles.heroIndex} aria-hidden="true">MUSE / {String(showcases.length).padStart(3, "0")}</span>
          </div>
        </section>
        <section aria-labelledby="collection-title">
          <h2 className={styles.srOnly} id="collection-title" tabIndex={-1} ref={collectionRef}>{text.collection}</h2>
          <div className={styles.filterBar}>
            <button className={`${styles.button} ${styles.filterToggle}`} aria-expanded={filtersOpen} aria-controls="gallery-filters" onClick={() => setFiltersOpen(!filtersOpen)}><SlidersHorizontal size={13} />{text.filters}</button>
            <div className={styles.filterFields} id="gallery-filters" data-open={filtersOpen}>
              <SearchFilter label={text.model} value={state.model} options={[{ value: "all", label: text.allModels }, ...models.map((item) => ({ value: modelSlug(item), label: item.model }))]} searchLabel={`${text.search} · ${text.model}`} onChange={(model) => filter({ model })} />
              <SearchFilter label={text.chain} value={state.chain} options={[{ value: "all", label: text.allChains }, ...chains.map((item) => ({ value: chainId(item), label: item.title }))]} searchLabel={`${text.search} · ${text.chain}`} onChange={(chain) => filter({ chain })} />
              <label className={styles.search}><Search size={15} /><span className={styles.srOnly}>{text.search}</span><input type="search" value={state.query} maxLength={160} onChange={(event) => filter({ query: event.target.value }, true)} placeholder={text.searchHint} /></label>
            </div>
            {activeFilters && <button className={styles.clearButton} onClick={clear}>{text.clear}<X size={12} /></button>}
            <span className={styles.resultCount} aria-live="polite">{filtered.length} {text.results}</span>
          </div>
          {pageItems.length ? <div className={styles.gallery}>{pageItems.map((item, index) => <ShowcaseCard key={item.id} item={item} index={index} locale={state.locale} fixedModel={state.model !== "all"} onOpen={() => open(item.id)} onVote={() => void votes.vote(item.id)} voteCount={votes.counts[item.id]} voted={votes.voted.has(item.id)} voting={votes.pending === item.id} votesAvailable={votes.available} />)}</div> : <div className={styles.empty}><Search size={25} style={{ margin: "auto" }} /><h2>{text.noResults}</h2><p>{text.noResultsHint}</p><button className={styles.primaryButton} onClick={clear}>{text.clear}</button></div>}
          <nav className={styles.pagination} aria-label={state.locale === "zh-CN" ? "作品分页" : "Collection pages"}>
            <button disabled={state.page === 1} aria-label={text.previous} onClick={() => paginate(state.page - 1)}><ChevronLeft size={16} /></button>
            <div className={styles.pageDesktop}>{pageNumbers(state.page, pageCount).map((page) => typeof page === "number" ? <button key={page} onClick={() => paginate(page)} aria-current={state.page === page ? "page" : undefined} aria-label={`${text.page} ${page}`}>{page}</button> : <span key={page} aria-hidden="true">…</span>)}</div>
            <span className={styles.pageMobile}>{state.page} / {pageCount}</span>
            <button disabled={state.page === pageCount} aria-label={text.next} onClick={() => paginate(state.page + 1)}><ChevronRight size={16} /></button>
          </nav>
        </section>
    </main>
    {selectedItem && <WorkDetail sources={sources} item={selectedItem} locale={state.locale} device={state.device} onDeviceChange={(device) => update({ device }, true)} onClose={() => update({ item: null }, true)} />}
  </ArenaShell>
}
