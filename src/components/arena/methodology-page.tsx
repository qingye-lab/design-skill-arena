"use client"

import { useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { showcases } from "@/data/showcases"
import { getChains, getModels } from "@/lib/arena-gallery"
import { contributionContext } from "@/lib/arena-context"
import { arenaCopy } from "./arena-copy"
import { ArenaShell, projectUrl } from "./arena-shell"
import { ArenaDialog, CopyButton } from "./arena-controls"
import { useArenaLocation } from "./use-arena-location"
import styles from "./arena.module.css"

export function MethodologyPage() {
  const { state, update } = useArenaLocation()
  const text = arenaCopy(state.locale)
  const [promptOpen, setPromptOpen] = useState(false)
  const prompt = contributionContext(state.locale)
  const sections = [{ id: "brief", label: text.brief }, { id: "conditions", label: text.controlled }, { id: "limits", label: text.metadata }, { id: "contribute", label: text.contribute }]
  return <ArenaShell locale={state.locale} onLocaleChange={(locale) => update({ locale })} current="method">
    <main id="main-content">
      <header className={styles.pageHero}><h1>{text.methodTitle}</h1></header>
      <div className={styles.methodLayout}>
        <nav className={styles.methodIndex} aria-label={text.method}>{sections.map((section, index) => <a key={section.id} href={`#${section.id}`}><span style={{ marginRight: 12, color: "var(--accent)" }}>0{index + 1}</span>{section.label}</a>)}</nav>
        <div>
          <section className={styles.methodSection} id="brief"><h2>{text.taskTitle}</h2><p>{text.taskBody}</p><h3>{text.requirementsTitle}</h3><ul>{text.requirements.map((requirement) => <li key={requirement}>{requirement}</li>)}</ul></section>
          <section className={styles.methodSection} id="conditions"><h2>{text.controlled}</h2><div className={styles.methodColumns}><div><h3>{text.fixedTitle}</h3><ul>{text.fixed.map((entry) => <li key={entry}>{entry}</li>)}</ul></div><div><h3>{text.variedTitle}</h3><ul>{text.varied.map((entry) => <li key={entry}>{entry}</li>)}</ul></div></div></section>
          <section className={styles.methodSection} id="limits"><h2>{text.limitsTitle}</h2><p>{text.limitsBody}</p><dl className={styles.record}><div><dt>{text.collection}</dt><dd>{getModels(showcases).length} {text.modelsCount} · {getChains(showcases).length} {text.chainsCount} · {showcases.length} {text.worksCount}</dd></div><div><dt>{text.generatedAt}</dt><dd>{text.unknown}</dd></div><div><dt>{text.skillVersion}</dt><dd>{text.unknown}</dd></div></dl></section>
          <section id="contribute" className={styles.contribution}><div><h3>{text.contributionTitle}</h3><p>{text.contributionBody}</p></div><button className={styles.primaryButton} onClick={() => setPromptOpen(true)}>{text.contributionPrompt}<ArrowUpRight size={14} /></button><a href={`${projectUrl}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noreferrer" className={styles.textLink}>{text.contributingGuide}<ArrowUpRight size={14} /></a></section>
        </div>
      </div>
    </main>
    {promptOpen && <ArenaDialog title={text.contributionDialog} locale={state.locale} onClose={() => setPromptOpen(false)} compact><div className={styles.promptContent}><pre className={styles.promptText}>{prompt}</pre><CopyButton value={prompt} label={state.locale === "zh-CN" ? "复制贡献提示词" : "Copy contribution prompt"} locale={state.locale} /></div></ArenaDialog>}
  </ArenaShell>
}
