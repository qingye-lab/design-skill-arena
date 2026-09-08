"use client"

import { useState } from "react"
import { ArrowUpRight, Heart, ImageOff } from "lucide-react"
import type { ShowcaseItem } from "@/types/showcase"
import { assetUrl } from "@/lib/assets"
import { designIntent } from "@/lib/arena-context"
import type { ArenaLocale } from "@/lib/arena-gallery"
import { arenaCopy } from "./arena-copy"
import styles from "./arena.module.css"

export function ShowcaseCard({ item, index, locale, fixedModel, onOpen, onVote, voteCount, voted, voting, votesAvailable }: {
  item: ShowcaseItem; index: number; locale: ArenaLocale; fixedModel: boolean; onOpen: () => void; onVote: () => void; voteCount?: number; voted: boolean; voting: boolean; votesAvailable: boolean | null
}) {
  const text = arenaCopy(locale)
  const [failed, setFailed] = useState(false)
  const label = `${text.viewWork}: ${item.model} · ${item.title}`
  return <article className={styles.card} data-work-id={item.id}>
    <button className={styles.cover} aria-label={label} onClick={onOpen}>
      {failed ? <span className={styles.previewError}><ImageOff size={22} /><span>{text.imageError}</span><span className={styles.small}>{text.viewWork} ↗</span></span> : <>
        {/* eslint-disable-next-line @next/next/no-img-element -- Compressed captures support R2 and local builds. */}
        <img src={assetUrl(item.screenshots.desktop)} alt={`${item.model} · ${item.title}`} loading={index < 3 ? "eager" : "lazy"} fetchPriority={index === 0 ? "high" : "auto"} decoding="async" width={1440} height={900} onError={() => setFailed(true)} />
      </>}
      <span className={styles.coverLabel} aria-hidden="true"><ArrowUpRight size={17} /></span>
    </button>
    <div className={styles.cardInfo}>
      <div className={styles.cardMeta}><span>{item.tags.slice(0, 2).join(" / ")}</span><span>{item.numericId} / 18</span></div>
      <button className={styles.cardHeading} onClick={onOpen} aria-label={label}><h3>{fixedModel ? item.title : item.model}</h3><p className={styles.cardSub}>{fixedModel ? item.model : item.title}</p></button>
      <p className={styles.cardGoal} title={`${text.designGoal}: ${designIntent(item, locale)}`}>{designIntent(item, locale)}</p>
      <div className={styles.cardActions}>
        <button onClick={onOpen}>{text.viewWork}<ArrowUpRight size={13} /></button>
        <button className={styles.like} onClick={onVote} disabled={!votesAvailable || voted || voting} aria-label={`${votesAvailable === false ? text.likesUnavailable : voted ? text.liked : text.like}: ${item.model} · ${item.title}`} title={votesAvailable === false ? text.likesUnavailable : text.like}><Heart size={13} fill={voted ? "currentColor" : "none"} />{voteCount !== undefined && <span>{voteCount}</span>}</button>
      </div>
    </div>
  </article>
}
