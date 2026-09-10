const MODEL_SLUGS = [
  "hy-4",
  "deepseek-v4.1-flash",
  "gpt-55",
  "qwen-37-max",
  "kimi-2.7-code",
  "gemini-3.1-pro",
  "gpt-5.6-sol",
  "kimi-k3",
  "qwen-3.8-max",
  "glm-5.3-flash",
  "deepseek-v4-flash",
  "gpt-6-astra",
  "fable-5.1",
  "glm-5.2",
  "claude-opus-4.8",
  "claude-opus-5",
  "claude-sonnet-5",
]
const SHOWCASE_IDS = [
  "standard-builder",
  "visual-frontend",
  "design-logic",
  "impeccable-full-flow",
  "artifact-builder",
  "ux-pro-reference",
  "component-system",
  "motion-bits",
  "standard-taste",
  "standard-impeccable",
  "visual-taste",
  "visual-impeccable",
  "design-ux-pro",
  "design-impeccable",
  "balanced-chain",
  "visual-premium-chain",
  "product-polish-chain",
  "max-quality-chain",
]

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000
const RATE_LIMIT_MAX = 30

function json(body, init = {}) {
  return Response.json(body, {
    ...init,
    headers: {
      "Cache-Control": "no-store",
      ...init.headers,
    },
  })
}

function isAllowedTargetId(targetId) {
  return MODEL_SLUGS.some((slug) => {
    const prefix = `${slug}-`
    return targetId.startsWith(prefix) && SHOWCASE_IDS.includes(targetId.slice(prefix.length))
  })
}

async function sha256(value) {
  const bytes = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest("SHA-256", bytes)
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("")
}

async function voterHash(request, env) {
  if (!env.VOTE_HASH_SALT) return null

  const ip =
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ||
    "local"
  const ua = request.headers.get("User-Agent") || "unknown"

  return sha256(`${env.VOTE_HASH_SALT}:${ip}:${ua}`)
}

async function limitVote(db, hash, now) {
  const row = await db
    .prepare("SELECT window_start, count FROM vote_rate_limits WHERE voter_hash = ?")
    .bind(hash)
    .first()

  if (!row || now - row.window_start >= RATE_LIMIT_WINDOW_MS) {
    await db
      .prepare("INSERT OR REPLACE INTO vote_rate_limits (voter_hash, window_start, count) VALUES (?, ?, 1)")
      .bind(hash, now)
      .run()
    return false
  }

  if (row.count >= RATE_LIMIT_MAX) return true

  await db
    .prepare("UPDATE vote_rate_limits SET count = count + 1 WHERE voter_hash = ?")
    .bind(hash)
    .run()
  return false
}

async function countVotes(db, targetId) {
  const row = await db
    .prepare("SELECT COUNT(*) AS count FROM showcase_votes WHERE target_id = ?")
    .bind(targetId)
    .first()
  return Number(row?.count || 0)
}

export async function onRequestGet({ env, request }) {
  if (!env.VOTES_DB) return json({ enabled: false, counts: {}, voted: [] })

  const ids = (new URL(request.url).searchParams.get("ids") || "")
    .split(",")
    .map((id) => id.trim())
    .filter(isAllowedTargetId)
    .slice(0, 20)

  if (ids.length === 0) return json({ enabled: false, counts: {}, voted: [] })

  const placeholders = ids.map(() => "?").join(",")
  const { results } = await env.VOTES_DB.prepare(
    `SELECT target_id, COUNT(*) AS count FROM showcase_votes WHERE target_id IN (${placeholders}) GROUP BY target_id`
  )
    .bind(...ids)
    .all()
  const counts = Object.fromEntries((results || []).map((row) => [row.target_id, Number(row.count)]))
  const hash = await voterHash(request, env)
  const voted = hash
    ? (
        await env.VOTES_DB.prepare(
          `SELECT target_id FROM showcase_votes WHERE voter_hash = ? AND target_id IN (${placeholders})`
        )
          .bind(hash, ...ids)
          .all()
      ).results?.map((row) => row.target_id) || []
    : []

  return json({ enabled: Boolean(hash), counts, voted }, { headers: { "Cache-Control": "private, max-age=60" } })
}

export async function onRequestPost({ env, request }) {
  if (!env.VOTES_DB) return json({ error: "Votes database is not configured." }, { status: 503 })

  const hash = await voterHash(request, env)
  if (!hash) return json({ error: "Vote salt is not configured." }, { status: 503 })

  let body
  try {
    body = await request.json()
  } catch {
    return json({ error: "Invalid JSON." }, { status: 400 })
  }

  const targetId = typeof body?.targetId === "string" ? body.targetId : ""
  if (!isAllowedTargetId(targetId)) return json({ error: "Invalid target." }, { status: 400 })

  const now = Date.now()
  if (await limitVote(env.VOTES_DB, hash, now)) {
    return json({ error: "Too many votes. Try later." }, { status: 429 })
  }

  await env.VOTES_DB.prepare(
    "INSERT OR IGNORE INTO showcase_votes (target_id, voter_hash, created_at) VALUES (?, ?, ?)"
  )
    .bind(targetId, hash, now)
    .run()

  return json({ targetId, count: await countVotes(env.VOTES_DB, targetId), voted: true })
}
