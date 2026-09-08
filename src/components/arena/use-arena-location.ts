"use client"

import { useCallback, useMemo, useSyncExternalStore } from "react"
import { showcases } from "@/data/showcases"
import { arenaHref, parseArenaState, type ArenaState } from "@/lib/arena-gallery"

const locationEvent = "arena:location"
function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback)
  window.addEventListener(locationEvent, callback)
  window.addEventListener("hashchange", callback)
  return () => {
    window.removeEventListener("popstate", callback)
    window.removeEventListener(locationEvent, callback)
    window.removeEventListener("hashchange", callback)
  }
}
function getSnapshot() {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`
}
const getServerSnapshot = () => "/"

export function useArenaLocation() {
  const href = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const state = useMemo(() => parseArenaState(href, showcases), [href])
  const update = useCallback((patch: Partial<ArenaState>, replace = false) => {
    const current = getSnapshot()
    const url = arenaHref(current, parseArenaState(current, showcases), patch)
    if (url !== current) {
      if (replace) window.history.replaceState(window.history.state, "", url)
      else window.history.pushState(window.history.state, "", url)
      window.dispatchEvent(new Event(locationEvent))
    }
  }, [])
  return { href, state, update }
}
