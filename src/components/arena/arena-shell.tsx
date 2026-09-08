"use client"

import Link from "next/link"
import { useEffect, type ReactNode } from "react"
import { ArrowUpRight, Menu } from "lucide-react"
import type { ArenaLocale } from "@/lib/arena-gallery"
import { arenaCopy } from "./arena-copy"
import styles from "./arena.module.css"

export const projectUrl = "https://github.com/liyanqing90/design-skill-arena"
export function localeHref(path: string, locale: ArenaLocale) {
  const url = new URL(path, "https://arena.invalid")
  if (locale === "en-US") url.searchParams.set("lang", "en")
  return `${url.pathname}${url.search}${url.hash}`
}

export function ArenaShell({ locale, onLocaleChange, current, children, collectionHref = "/" }: {
  locale: ArenaLocale
  onLocaleChange: (locale: ArenaLocale) => void
  current: "works" | "skills" | "method"
  children: ReactNode
  collectionHref?: string
}) {
  const text = arenaCopy(locale)
  useEffect(() => { document.documentElement.lang = locale === "zh-CN" ? "zh-CN" : "en" }, [locale])
  const links = [
    { key: "works", href: collectionHref, label: text.works },
    { key: "skills", href: "/skills/", label: text.skills },
    { key: "method", href: "/methodology/", label: text.method },
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
          <a className={styles.iconButton} href={projectUrl} target="_blank" rel="noreferrer" aria-label={text.github}><span>GitHub</span><ArrowUpRight size={12} /></a>
          <div className={styles.languageSwitch} role="group" aria-label={locale === "zh-CN" ? "界面语言" : "Interface language"}><button aria-pressed={locale === "zh-CN"} onClick={() => onLocaleChange("zh-CN")}>中文</button><button aria-pressed={locale === "en-US"} onClick={() => onLocaleChange("en-US")}>English</button></div>
          <details className={styles.mobileMenu}>
            <summary className={styles.iconButton} aria-label={text.menu}><Menu size={19} /></summary>
            <nav aria-label={text.menu}>
              {links.map((link) => <Link key={link.key} href={localeHref(link.href, locale)} aria-current={current === link.key ? "page" : undefined} onClick={(event) => event.currentTarget.closest("details")?.removeAttribute("open")}>{link.label}</Link>)}
              <a href={projectUrl} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={13} /></a>
            </nav>
          </details>
        </div>
      </header>
      {children}
      <footer className={styles.footer}>
        <div><p>{text.footer}</p><p>{text.footerNote}</p></div>
        <Link href={localeHref("/methodology/#contribute", locale)}>{text.contribute}<ArrowUpRight size={14} /></Link>
      </footer>
    </div>
  </div>
}
