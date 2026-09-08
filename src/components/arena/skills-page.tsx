"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowUpRight, Info, Search } from "lucide-react"
import { showcases } from "@/data/showcases"
import { chainId, getChains } from "@/lib/arena-gallery"
import type { PublicArenaSkill } from "@/lib/public-arena-skills"
import { arenaCopy } from "./arena-copy"
import { ArenaShell, localeHref } from "./arena-shell"
import { useArenaLocation } from "./use-arena-location"
import styles from "./arena.module.css"

const chains = getChains(showcases)
export function SkillsPage({ sources }: { sources: PublicArenaSkill[] }) {
  const { state, update } = useArenaLocation()
  const [kind, setKind] = useState("all")
  const text = arenaCopy(state.locale)
  const typeLabels = state.locale === "zh-CN" ? { skill: "设计技能", library: "组件库", guideline: "设计规范" } : { skill: "Design skill", library: "Component library", guideline: "Design guideline" }
  const query = state.query.trim().toLowerCase()
  const filtered = sources.filter((skill) => (kind === "all" || skill.type === kind) && (!query || [skill.name, skill.id, skill.summary, skill.summaryEn, ...skill.aliases].join(" ").toLowerCase().includes(query)))
  return <ArenaShell locale={state.locale} onLocaleChange={(locale) => update({ locale })} current="skills">
    <main id="main-content">
      <header className={styles.pageHero}><h1>{text.skillsTitle}</h1></header>
      <div className={styles.skillsToolbar}>
        <label className={styles.search}><Search size={15} /><span className={styles.srOnly}>{text.searchSkills}</span><input type="search" placeholder={text.skillSearchHint} value={state.query} maxLength={160} onChange={(event) => update({ query: event.target.value }, true)} /></label>
        <select className={styles.select} value={kind} onChange={(event) => setKind(event.target.value)} aria-label={text.skillType}><option value="all">{text.allTypes}</option>{Object.entries(typeLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select>
        <span className={styles.resultCount} aria-live="polite">{filtered.length} / {sources.length}</span>
      </div>
      <div className={styles.skillRows}>{filtered.map((skill) => {
        const related = chains.filter((item) => item.skills.includes(skill.id))
        return <article className={styles.skillRow} id={skill.id} key={skill.id}>
          <span className={styles.skillNumber}>{String(sources.indexOf(skill) + 1).padStart(2, "0")}</span>
          <div><h2 className={styles.skillTitle}>{skill.name}</h2><span className={styles.badge}>{typeLabels[skill.type]}</span>
            <div className={styles.sourceLinks}>{skill.officialUrl && <a href={skill.officialUrl} target="_blank" rel="noreferrer">{text.official}<ArrowUpRight size={12} /></a>}{skill.githubUrl && <a href={skill.githubUrl} target="_blank" rel="noreferrer">{text.repository}<ArrowUpRight size={12} /></a>}</div>
            <div className={styles.skillRevision}><span>{text.sourceRevision}</span><span title={skill.revision ?? undefined}>{skill.revision ? skill.revision.slice(0, 8) : text.notRecorded}</span>{skill.historical && <span className={styles.badge}>{text.historical}</span>}</div>
          </div>
          <div className={styles.skillBody}><p>{state.locale === "zh-CN" ? skill.summary : skill.summaryEn}</p><span className={styles.small}>{text.combinations} · {related.length}</span><div className={styles.relatedChains}>{related.map((item) => <Link key={chainId(item)} href={localeHref(`/?chain=${chainId(item)}`, state.locale)}>{item.title}<ArrowUpRight size={11} /></Link>)}</div></div>
        </article>
      })}</div>
      {!filtered.length && <div className={styles.empty}><h2>{text.noSkills}</h2><button className={styles.button} onClick={() => { update({ query: "" }); setKind("all") }}>{text.clear}</button></div>}
      <div className={styles.pageNote}><Info size={15} /><div><p>{text.versionNote}</p></div></div>
    </main>
  </ArenaShell>
}
