"use client"

import { useCallback, useEffect, useRef, useState } from "react"

const storageKey = "design-skill-arena:voted"
type VoteData = { enabled?: boolean; counts?: Record<string, number>; count?: number; voted?: string[] | boolean }

export function useArenaVotes(ids: string[]) {
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [voted, setVoted] = useState<Set<string>>(new Set())
  const [available, setAvailable] = useState<boolean | null>(null)
  const [pending, setPending] = useState<string | null>(null)
  const loaded = useRef(new Set<string>())
  const post = useRef<AbortController | null>(null)
  const posted = useRef(new Set<string>())
  const key = ids.slice(0, 20).join(",")
  useEffect(() => {
    let active = true
    Promise.resolve().then(() => {
      if (!active) return
      try { const saved: unknown = JSON.parse(localStorage.getItem(storageKey) || "[]"); if (Array.isArray(saved)) setVoted(new Set(saved.filter((id): id is string => typeof id === "string"))) } catch { /* Storage is optional. */ }
    })
    return () => { active = false; post.current?.abort() }
  }, [])
  useEffect(() => {
    const batch = key.split(",").filter((id) => id && !loaded.current.has(id))
    if (!batch.length || available === false) return
    const controller = new AbortController()
    async function load() {
      try {
        const response = await fetch(`/api/votes?ids=${encodeURIComponent(batch.join(","))}`, { signal: controller.signal })
        if (!response.ok) throw new Error("Votes unavailable")
        const data: VoteData = await response.json()
        if (controller.signal.aborted) return
        if (data.enabled !== true) { setAvailable(false); return }
        setCounts((current) => {
          const next = { ...current }
          batch.forEach((id) => { if (!posted.current.has(id)) next[id] = Number.isFinite(data.counts?.[id]) ? Number(data.counts![id]) : 0 })
          return next
        })
        batch.forEach((id) => loaded.current.add(id))
        if (Array.isArray(data.voted)) { const serverVoted = data.voted; setVoted((current) => new Set([...current, ...serverVoted])) }
        setAvailable(true)
      } catch { if (!controller.signal.aborted) setAvailable(false) }
    }
    void load()
    return () => controller.abort()
  }, [key, available])
  const vote = useCallback(async (id: string) => {
    if (!available || voted.has(id) || post.current) return
    const controller = new AbortController()
    post.current = controller
    setPending(id)
    try {
      const response = await fetch("/api/votes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ targetId: id }), signal: controller.signal })
      if (!response.ok) throw new Error("Vote failed")
      const data: VoteData = await response.json()
      if (controller.signal.aborted) return
      if (typeof data.count !== "number" || !Number.isFinite(data.count)) throw new Error("Invalid count")
      posted.current.add(id)
      setCounts((current) => ({ ...current, [id]: data.count! }))
      const next = new Set([...voted, id])
      setVoted(next)
      try { localStorage.setItem(storageKey, JSON.stringify([...next])) } catch { /* A successful vote does not depend on local storage. */ }
    } catch { if (!controller.signal.aborted) setAvailable(false) }
    finally { post.current = null; if (!controller.signal.aborted) setPending(null) }
  }, [available, voted])
  return { counts, voted, available, pending, vote }
}
