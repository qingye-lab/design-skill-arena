"use client"

import { usePathname } from "next/navigation"

import { ArenaTopNav } from "@/components/layout/arena-top-nav"
import { SiteFooter } from "@/components/layout/site-footer"

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHome = pathname === "/"
  const isModelShowcase = pathname.startsWith("/model-showcase/")

  if (isHome || isModelShowcase || /^\/(skills|methodology)\/?$/.test(pathname)) {
    return <>{children}</>
  }

  return (
    <>
      <header className="bg-[#f7f7f2] text-zinc-950">
        <div className="mx-auto max-w-[1760px] px-4 pt-4 sm:px-6 lg:px-8">
          <ArenaTopNav />
        </div>
      </header>
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </>
  )
}
