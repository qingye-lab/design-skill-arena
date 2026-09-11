"use client"

import Link from "next/link"
import { useEffect, useRef, type ReactNode } from "react"
import { ArrowUpRight, Check, Copy, Globe, Menu } from "lucide-react"
import type { ArenaLocale } from "@/lib/arena-gallery"
import { arenaCopy } from "./arena-copy"
import styles from "./arena.module.css"

export const projectUrl = "https://github.com/liyanqing90/design-skill-arena"
export const authorUrl = "https://yanqing.li"
function GithubMark({ size = 14 }: { size?: number }) {
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.4-4-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.4-1.3-5.4-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0C17.7 4.8 18.7 5 18.7 5c.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1.1.9 2.2v3.8c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" /></svg>
}
export function localeHref(path: string, locale: ArenaLocale) {
  const url = new URL(path, "https://arena.invalid")
  if (locale === "en-US") url.searchParams.set("lang", "en")
  return `${url.pathname}${url.search}${url.hash}`
}

export function ArenaShell({ locale, onLocaleChange, current, children, onPromptOpen }: {
  locale: ArenaLocale
  onLocaleChange: (locale: ArenaLocale) => void
  current: "works" | "skills" | "method"
  children: ReactNode
  onPromptOpen?: () => void
}) {
  const text = arenaCopy(locale)
  const languageRef = useRef<HTMLDetailsElement>(null)
  useEffect(() => { document.documentElement.lang = locale === "zh-CN" ? "zh-CN" : "en" }, [locale])
  useEffect(() => {
    const close = (event: PointerEvent) => { if (languageRef.current?.open && !languageRef.current.contains(event.target as Node)) languageRef.current.open = false }
    document.addEventListener("pointerdown", close)
    return () => document.removeEventListener("pointerdown", close)
  }, [])
  const languages: { locale: ArenaLocale; label: string }[] = [{ locale: "zh-CN", label: "中文" }, { locale: "en-US", label: "English" }]
  function pickLocale(next: ArenaLocale) {
    if (languageRef.current) { languageRef.current.open = false; languageRef.current.querySelector("summary")?.focus() }
    if (next !== locale) onLocaleChange(next)
  }
  const links = [
    { key: "skills", href: "/skills/", label: text.skills },
  ]
  return <div className={styles.shell}>
    <a className={styles.skip} href="#main-content">{text.skip}</a>
    <div className={styles.wrap}>
      <header className={styles.header}>
        <Link className={styles.brand} href={localeHref("/", locale)} aria-label="Design Skill Arena">
          <span className={styles.brandMark} aria-hidden="true"><i /><i /><i /><i /></span>
          <span>Design Skill Arena<span style={{ color: "var(--accent)" }}>.</span></span>
        </Link>
        <nav className={styles.nav} aria-label={text.menu}>
          {links.map((link) => <Link key={link.key} href={localeHref(link.href, locale)} aria-current={current === link.key ? "page" : undefined}>{link.label}</Link>)}
          {onPromptOpen && <button className={styles.promptAction} onClick={onPromptOpen}><Copy size={14} /><span>{text.promptAction}</span></button>}
        </nav>
        <div className={styles.navSecondary}>
          <a className={styles.outboundLink} href={authorUrl} target="_blank" rel="noreferrer">{text.authorSite}</a>
          <a className={styles.outboundLink} href={projectUrl} target="_blank" rel="noreferrer" aria-label={text.github}><GithubMark size={16} /></a>
          <details className={styles.languageSwitch} ref={languageRef} onToggle={(event) => { if (event.currentTarget.open) event.currentTarget.parentElement?.querySelector(`.${styles.mobileMenu}`)?.removeAttribute("open") }}>
            <summary className={styles.languageSummary} aria-label={text.language} title={text.language}><Globe size={15} /><span>{locale === "zh-CN" ? "中" : "EN"}</span></summary>
            <div className={styles.languagePanel} role="group" aria-label={text.language}>
              {languages.map((item) => <button key={item.locale} aria-pressed={locale === item.locale} onClick={() => pickLocale(item.locale)}><span>{item.label}</span>{locale === item.locale && <Check size={13} />}</button>)}
            </div>
          </details>
          <details className={styles.mobileMenu} onToggle={(event) => { if (event.currentTarget.open) languageRef.current?.removeAttribute("open") }}>
            <summary className={styles.iconButton} aria-label={text.menu}><Menu size={19} /></summary>
            <nav aria-label={text.menu}>
              {links.map((link) => <Link key={link.key} href={localeHref(link.href, locale)} aria-current={current === link.key ? "page" : undefined} onClick={(event) => event.currentTarget.closest("details")?.removeAttribute("open")}>{link.label}</Link>)}
              {onPromptOpen && <button onClick={(event) => { onPromptOpen(); event.currentTarget.closest("details")?.removeAttribute("open") }}><Copy size={14} />{text.promptAction}</button>}
              <a href={authorUrl} target="_blank" rel="noreferrer">{text.authorSite}</a>
              <a href={projectUrl} target="_blank" rel="noreferrer"><GithubMark size={14} />GitHub</a>
              <div className={styles.mobileLanguages}>{languages.map((item) => <button key={item.locale} aria-pressed={locale === item.locale} onClick={(event) => { pickLocale(item.locale); event.currentTarget.closest("details")?.removeAttribute("open") }}><span>{item.label}</span>{locale === item.locale && <Check size={13} />}</button>)}</div>
            </nav>
          </details>
        </div>
      </header>
      {children}
      <footer className={styles.footer}>
        <p>{text.footer}</p>
        <div className={styles.footerMeta}>
          <Link className={styles.footerBrief} href={localeHref("/methodology/#brief", locale)}><span className={styles.small}>{text.brief}</span><strong>{text.briefName}</strong></Link>
          <Link className={styles.footerContribute} href={localeHref("/methodology/#contribute", locale)}>{text.contribute}<ArrowUpRight size={14} /></Link>
        </div>
      </footer>
    </div>
  </div>
}
