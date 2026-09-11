"use client"

import Link from "next/link"
import { useEffect, useRef, type ReactNode } from "react"
import { ArrowUpRight, Check, Copy, Globe, Menu } from "lucide-react"
import type { ArenaLocale } from "@/lib/arena-gallery"
import { arenaCopy } from "./arena-copy"
import styles from "./arena.module.css"

export const projectUrl = "https://github.com/liyanqing90/design-skill-arena"
export const authorUrl = "https://yanqing.li"
export function localeHref(path: string, locale: ArenaLocale) {
  const url = new URL(path, "https://arena.invalid")
  if (locale === "en-US") url.searchParams.set("lang", "en")
  return `${url.pathname}${url.search}${url.hash}`
}

export function ArenaShell({ locale, onLocaleChange, current, children, collectionHref = "/", onPromptOpen }: {
  locale: ArenaLocale
  onLocaleChange: (locale: ArenaLocale) => void
  current: "works" | "skills" | "method"
  children: ReactNode
  collectionHref?: string
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
    { key: "works", href: collectionHref, label: text.works },
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
        </nav>
        <div className={styles.navSecondary}>
          {onPromptOpen && <button className={`${styles.iconButton} ${styles.promptAction}`} onClick={onPromptOpen}><Copy size={13} /><span>{text.promptAction}</span></button>}
          <a className={styles.outboundLink} href={authorUrl} target="_blank" rel="noreferrer" aria-label={text.authorSite}>yanqing.li<ArrowUpRight size={11} /></a>
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
              {onPromptOpen && <button onClick={(event) => { onPromptOpen(); event.currentTarget.closest("details")?.removeAttribute("open") }}><Copy size={13} />{text.copyPrompt}</button>}
              <a href={authorUrl} target="_blank" rel="noreferrer">{text.authorSite} <ArrowUpRight size={13} /></a>
              <a href={projectUrl} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={13} /></a>
              <div className={styles.mobileLanguages}>{languages.map((item) => <button key={item.locale} aria-pressed={locale === item.locale} onClick={(event) => { pickLocale(item.locale); event.currentTarget.closest("details")?.removeAttribute("open") }}><span>{item.label}</span>{locale === item.locale && <Check size={13} />}</button>)}</div>
            </nav>
          </details>
        </div>
      </header>
      {children}
      <footer className={styles.footer}>
        <p>{text.footer}</p>
        <div className={styles.footerMeta}>
          <Link className={styles.footerBrief} href={localeHref("/methodology/#brief", locale)}><span className={styles.small}>{text.brief}</span><strong>{text.briefName}</strong><ArrowUpRight size={14} /></Link>
          <div className={styles.footerLinks}>
            <a href={projectUrl} target="_blank" rel="noreferrer">GitHub<ArrowUpRight size={13} /></a>
            <Link href={localeHref("/methodology/#contribute", locale)}>{text.contribute}<ArrowUpRight size={14} /></Link>
          </div>
        </div>
      </footer>
    </div>
  </div>
}
