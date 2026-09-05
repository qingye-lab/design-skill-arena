"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  Bike,
  Bookmark,
  Check,
  ChevronDown,
  Dumbbell,
  FileImage,
  FileText,
  Heart,
  Home,
  Leaf,
  Loader2,
  MessageCircle,
  Send,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Mock data                                                           */
/* ------------------------------------------------------------------ */

type ConceptId = "A" | "B" | "C";
type Audience = "athletes" | "parents" | "curious" | "gym";
type Channel = "instagram" | "tiktok" | "newsletter" | "ooh";
type Tone = "calm" | "bold" | "playful";
type Style = "paper" | "earth" | "contrast" | "botanical";
type Format = "post" | "story" | "banner";

type Concept = {
  id: ConceptId;
  name: string;
  flavor: string;
  origin: string;
  angle: string;
  hue: [string, string];
  headlines: [string, string];
  tag: string;
  base: { reach: number; ctr: number; conv: number };
};

const CONCEPTS: Concept[] = [
  {
    id: "A",
    name: "Single Origin",
    flavor: "Peruvian Cacao",
    origin: "Piura, Peru",
    angle: "Taste you can trace",
    hue: ["#6b4a3a", "#c9a68a"],
    headlines: ["Protein with a postcode.", "One farm. One flavor. 24g."],
    tag: "PeruvianCacao",
    base: { reach: 48200, ctr: 2.4, conv: 1.6 },
  },
  {
    id: "B",
    name: "Morning Field",
    flavor: "Madagascar Vanilla",
    origin: "Sava, Madagascar",
    angle: "Fuel that grew somewhere",
    hue: ["#a8813f", "#ead9b0"],
    headlines: ["Breakfast, but honest.", "Vanilla that remembers the vine."],
    tag: "MadagascarVanilla",
    base: { reach: 39600, ctr: 2.9, conv: 1.9 },
  },
  {
    id: "C",
    name: "Green Hour",
    flavor: "Kyoto Matcha",
    origin: "Uji, Kyoto",
    angle: "Clean energy, clean label",
    hue: ["#4d6b3f", "#bfd1a2"],
    headlines: ["Slow caffeine. Fast recovery.", "Green, grown, ground."],
    tag: "KyotoMatcha",
    base: { reach: 56400, ctr: 2.0, conv: 1.3 },
  },
];

const AUDIENCES: { id: Audience; label: string; icon: typeof Bike; line: string; tag: string }[] = [
  { id: "athletes", label: "Endurance athletes", icon: Bike, line: "for people who count kilometres, not calories", tag: "LongRun" },
  { id: "parents", label: "Busy parents", icon: Home, line: "for mornings that start before you do", tag: "SchoolRun" },
  { id: "curious", label: "Plant-curious", icon: Leaf, line: "for anyone trying plant protein for the first time", tag: "PlantBased" },
  { id: "gym", label: "Gym regulars", icon: Dumbbell, line: "for the 6am shift at the squat rack", tag: "TrainClean" },
];

const CHANNELS: { id: Channel; label: string; reach: number; ctr: number; conv: number; tag: string }[] = [
  { id: "instagram", label: "Instagram", reach: 1, ctr: 1, conv: 1, tag: "Reels" },
  { id: "tiktok", label: "TikTok", reach: 1.35, ctr: 0.9, conv: 0.85, tag: "FYP" },
  { id: "newsletter", label: "Newsletter", reach: 0.32, ctr: 2.2, conv: 1.6, tag: "Inbox" },
  { id: "ooh", label: "Out-of-home", reach: 2.4, ctr: 0.15, conv: 0.4, tag: "Billboard" },
];

const TONES: { id: Tone; label: string }[] = [
  { id: "calm", label: "Calm" },
  { id: "bold", label: "Bold" },
  { id: "playful", label: "Playful" },
];

const STYLES: { id: Style; label: string; swatch: string; overlay: string }[] = [
  { id: "paper", label: "Paper", swatch: "#efeae0", overlay: "rgba(247,246,242,0.55)" },
  { id: "earth", label: "Earth", swatch: "#8b6a4f", overlay: "rgba(60,40,30,0.25)" },
  { id: "contrast", label: "Contrast", swatch: "#2b2a27", overlay: "rgba(20,20,18,0.55)" },
  { id: "botanical", label: "Botanical", swatch: "#5b6b4e", overlay: "rgba(91,107,78,0.35)" },
];

const FORMATS: { id: Format; label: string }[] = [
  { id: "post", label: "Post" },
  { id: "story", label: "Story" },
  { id: "banner", label: "Banner" },
];

const SUB_COPY: Record<Tone, (c: Concept) => string> = {
  calm: (c) => `${c.flavor}, grown in ${c.origin}. Pea and pumpkin seed protein. Nothing else added.`,
  bold: (c) => `One origin. 24g protein. ${c.flavor} that doesn't need a flavour lab.`,
  playful: (c) => `Your smoothie just got a passport stamped in ${c.origin}.`,
};

type Activity = { id: number; text: string; at: number };

const BRIEF_MIN = 20;
const BRIEF_MAX = 320;
const MOSS = "#5b6b4e";
const TERRACOTTA = "#c96f4a";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const ring =
  "outline-none focus-visible:ring-2 focus-visible:ring-[#5b6b4e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f6f2]";

function formatReach(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : `${Math.round(n)}`;
}

function relativeTime(at: number, now: number) {
  const s = Math.max(0, Math.round((now - at) / 1000));
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.round(m / 60)}h ago`;
}

/** Wall-clock read, only ever invoked from event handlers. */
function stamp() {
  return Date.now();
}

function clock(at: number) {
  return new Date(at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/** Deterministic 8-bar shape: a gentle ramp with per-concept/channel texture. */
function bars(seed: number, metric: number): number[] {
  const shape = [0.32, 0.44, 0.4, 0.58, 0.54, 0.7, 0.78, 0.92];
  return shape.map((v, i) => {
    const jitter = (((seed + 1) * (i + 2) * (metric + 3)) % 17) / 100;
    return Math.min(1, Math.max(0.15, v + jitter - 0.08));
  });
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function BalancedChain() {
  const [brief, setBrief] = useState(
    "Launch Root, a plant-based protein powder with three single-origin flavors. Lead with traceability and taste, not macros.",
  );
  const [concept, setConcept] = useState<ConceptId>("B");
  const [audience, setAudience] = useState<Audience>("curious");
  const [channel, setChannel] = useState<Channel>("instagram");
  const [tone, setTone] = useState<Tone>("calm");
  const [style, setStyle] = useState<Style>("paper");
  const [format, setFormat] = useState<Format>("post");
  const [variant, setVariant] = useState<0 | 1>(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [exportOpen, setExportOpen] = useState(false);

  const [now, setNow] = useState(() => Date.now());
  const [activity, setActivity] = useState<Activity[]>(() => {
    const t = Date.now();
    return [
      { id: 3, text: "Concept B selected", at: t - 42_000 },
      { id: 2, text: "Brief updated", at: t - 4 * 60_000 },
      { id: 1, text: "Campaign created · Root launch", at: t - 26 * 60_000 },
    ];
  });

  const generateCount = useRef(0);
  const nextId = useRef(4);
  const timers = useRef<Set<number>>(new Set());
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const exportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const set = timers.current;
    return () => {
      set.forEach((t) => window.clearTimeout(t));
      set.clear();
    };
  }, []);

  useEffect(() => {
    if (!exportOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!exportRef.current?.contains(e.target as Node)) setExportOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExportOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [exportOpen]);

  const schedule = (fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timers.current.delete(id);
      fn();
    }, ms);
    timers.current.add(id);
  };

  const log = (text: string) => {
    const t = stamp();
    setNow(t);
    setActivity((a) => [{ id: nextId.current++, text, at: t }, ...a].slice(0, 8));
  };

  const showToast = (msg: string) => {
    setToast(msg);
    schedule(() => setToast(null), 2500);
  };

  const current = CONCEPTS.find((c) => c.id === concept)!;
  const aud = AUDIENCES.find((a) => a.id === audience)!;
  const ch = CHANNELS.find((c) => c.id === channel)!;
  const st = STYLES.find((s) => s.id === style)!;
  const briefValid = brief.trim().length >= BRIEF_MIN;

  const forecast = useMemo(() => {
    const toneMod = { calm: { reach: 1, ctr: 1, conv: 1.06 }, bold: { reach: 1, ctr: 1.08, conv: 1 }, playful: { reach: 1.05, ctr: 1.03, conv: 0.98 } }[tone];
    const seed = CONCEPTS.indexOf(current) * 4 + CHANNELS.indexOf(ch);
    return [
      { label: "Reach", value: formatReach(current.base.reach * ch.reach * toneMod.reach), bars: bars(seed, 0) },
      { label: "CTR", value: `${(current.base.ctr * ch.ctr * toneMod.ctr).toFixed(2)}%`, bars: bars(seed, 1) },
      { label: "Conversion", value: `${(current.base.conv * ch.conv * toneMod.conv).toFixed(2)}%`, bars: bars(seed, 2) },
    ];
  }, [current, ch, tone]);

  /* ---- actions ---------------------------------------------------- */

  // Error rule: brief under 20 chars fails immediately; otherwise every 4th
  // generate attempt fails after the loading window (simulated timeout).
  const generate = () => {
    if (loading) return;
    setExportOpen(false);
    if (!briefValid) {
      setError(`Brief needs at least ${BRIEF_MIN} characters before Muse can generate.`);
      log("Generate blocked · brief too short");
      return;
    }
    setError(null);
    setLoading(true);
    generateCount.current += 1;
    const willFail = generateCount.current % 4 === 0;
    log(`Generating concept ${concept}…`);
    schedule(() => {
      setLoading(false);
      if (willFail) {
        setError("Generation timed out. The model didn't return a concept in time.");
        log(`Concept ${concept} failed · timeout`);
        return;
      }
      setVariant((v) => (v === 0 ? 1 : 0));
      showToast("Concept refreshed");
      log(`Concept ${concept} regenerated`);
    }, 1500);
  };

  const save = () => {
    const t = stamp();
    setSaved(true);
    setSavedAt(t);
    log("Draft saved");
    schedule(() => setSaved(false), 2000);
  };

  const exportAs = (kind: "PNG" | "PDF") => {
    setExportOpen(false);
    log(`Exported ${kind} · ${FORMATS.find((f) => f.id === format)!.label}`);
    showToast(`${kind} exported`);
  };

  const pick = (id: ConceptId) => {
    if (id === concept) return;
    setConcept(id);
    log(`Concept ${id} selected`);
  };

  const onCardKey = (e: React.KeyboardEvent, idx: number) => {
    const delta = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (idx + delta + CONCEPTS.length) % CONCEPTS.length;
    pick(CONCEPTS[next].id);
    cardRefs.current[next]?.focus();
  };

  /* ---- derived copy ----------------------------------------------- */

  const headline = current.headlines[variant];
  const sub = SUB_COPY[tone](current);
  const hashtags = `#Root #${current.tag} #${aud.tag} #${ch.tag}`;
  const imageGradient = `linear-gradient(160deg, ${current.hue[0]} 0%, ${current.hue[1]} 100%)`;
  const darkText = style === "paper" || (style === "earth" && concept === "B");

  /* ---- render ----------------------------------------------------- */

  return (
    <div className="min-h-dvh bg-[#f7f6f2] text-[#2b2a27] antialiased">
      <style>{`
        @keyframes fable-bc-shimmer { from { background-position: 200% 0 } to { background-position: -200% 0 } }
        .fable-bc-shimmer { background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.55) 50%, rgba(255,255,255,0) 100%); background-size: 200% 100%; animation: fable-bc-shimmer 1.4s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .fable-bc-shimmer { animation: none; background: rgba(255,255,255,.35) } }
      `}</style>

      <div className="mx-auto max-w-[1280px] px-4 pb-24 sm:px-6 lg:pb-10">
        {/* Header */}
        <header className="flex flex-col gap-3 border-b border-[#d9d6cd] py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="text-lg font-semibold tracking-tight">Muse</span>
            <span className="text-sm text-[#6b6862]">Balanced Chain</span>
            <span className="hidden h-4 w-px bg-[#d9d6cd] sm:block" aria-hidden />
            <span className="rounded-full border border-[#c9c5ba] px-2.5 py-0.5 text-xs font-medium">Fable 5.1</span>
            <span className="rounded-full border border-[#c9c5ba] px-2.5 py-0.5 text-xs text-[#4f4d48]">
              frontend-app-builder + taste-skill + impeccable
            </span>
            {savedAt !== null && (
              <span className="text-xs text-[#6b6862]">Draft saved · {clock(savedAt)}</span>
            )}
          </div>
          <div role="radiogroup" aria-label="Preview as" className="inline-flex w-fit items-center gap-1 rounded-[10px] border border-[#c9c5ba] bg-white p-1 text-xs">
            <span className="px-2 text-[#6b6862]">Preview as</span>
            {FORMATS.map((f) => (
              <button
                key={f.id}
                type="button"
                role="radio"
                aria-checked={format === f.id}
                onClick={() => {
                  setFormat(f.id);
                  log(`Preview switched to ${f.label}`);
                }}
                className={`rounded-[7px] px-2.5 py-1 font-medium transition-colors ${ring} ${
                  format === f.id ? "bg-[#2b2a27] text-white" : "text-[#4f4d48] hover:bg-[#f0eee8]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </header>

        <div className="grid gap-8 pt-6 lg:grid-cols-[55fr_45fr] lg:gap-10">
          {/* LEFT: preview */}
          <section aria-labelledby="preview-heading" className="flex flex-col items-center gap-6 lg:items-stretch">
            <h2 id="preview-heading" className="sr-only">Creative preview</h2>

            {/* Phone */}
            <div className="mx-auto w-full max-w-[320px] sm:max-w-[360px]">
              <div className="relative rounded-[2.5rem] border-[8px] border-[#2b2a27] bg-white shadow-[0_24px_60px_-30px_rgba(43,42,39,0.45)]">
                <div className="absolute left-1/2 top-0 z-10 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-[#2b2a27]" aria-hidden />
                <div className="overflow-hidden rounded-[2rem]">
                  {/* Avatar row */}
                  <div className="flex items-center gap-2.5 px-4 pb-3 pt-9">
                    <span className="flex size-8 items-center justify-center rounded-full text-xs font-semibold text-white" style={{ background: MOSS }}>R</span>
                    <div className="min-w-0 flex-1 leading-tight">
                      <p className="text-[13px] font-semibold">root.protein</p>
                      <p className="text-[11px] text-[#6b6862]">Sponsored · {ch.label}</p>
                    </div>
                    <span className="text-[#6b6862]">···</span>
                  </div>

                  {/* Image */}
                  <div
                    className={`relative w-full overflow-hidden ${
                      format === "post" ? "aspect-square" : format === "story" ? "aspect-[9/14]" : "aspect-[3/1]"
                    }`}
                    style={{ background: imageGradient }}
                    aria-label={`${current.name} key visual`}
                    role="img"
                  >
                    <div className="absolute inset-0" style={{ background: st.overlay }} />
                    <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
                      <defs>
                        <radialGradient id="fable-bc-scoop" cx="40%" cy="35%" r="70%">
                          <stop offset="0" stopColor="#ffffff" stopOpacity="0.85" />
                          <stop offset="1" stopColor={current.hue[1]} stopOpacity="0.9" />
                        </radialGradient>
                      </defs>
                      <ellipse cx="128" cy="138" rx="58" ry="20" fill="rgba(0,0,0,0.18)" />
                      <path d="M74 132 C74 96 182 96 182 132 C182 152 74 152 74 132 Z" fill="url(#fable-bc-scoop)" />
                      <path d="M74 132 L64 60 C64 52 72 52 72 60 L82 128 Z" fill={current.hue[0]} opacity="0.9" />
                      <path d="M38 80 C20 60 36 24 66 30 C70 62 56 84 38 80 Z" fill={MOSS} opacity="0.9" />
                      <path d="M40 78 C48 60 56 46 64 34" stroke="#f7f6f2" strokeWidth="1.5" fill="none" opacity="0.8" />
                    </svg>
                    {format === "story" && !loading && (
                      <div className={`absolute inset-x-0 bottom-0 p-5 ${darkText ? "text-[#2b2a27]" : "text-white"}`}>
                        <p className="font-serif text-[26px] leading-[1.05] tracking-tight">{headline}</p>
                        <p className="mt-2 text-[12px] opacity-90">{sub}</p>
                      </div>
                    )}
                    {format !== "story" && !loading && (
                      <p className={`absolute left-4 top-4 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${darkText ? "bg-[#2b2a27]/80 text-white" : "bg-white/80 text-[#2b2a27]"}`}>
                        {current.flavor}
                      </p>
                    )}
                    {loading && <div className="fable-bc-shimmer absolute inset-0" aria-hidden />}
                  </div>

                  {/* Actions row */}
                  <div className="flex items-center gap-4 px-4 pt-3 text-[#2b2a27]">
                    <Heart className="size-5" aria-hidden />
                    <MessageCircle className="size-5" aria-hidden />
                    <Send className="size-5" aria-hidden />
                    <Bookmark className="ml-auto size-5" aria-hidden />
                  </div>

                  {/* Caption */}
                  <div className="space-y-1.5 px-4 pb-5 pt-2 text-[13px] leading-snug" aria-live="polite" aria-busy={loading}>
                    {loading ? (
                      <>
                        <div className="h-4 w-4/5 animate-pulse rounded bg-[#e9e6dd]" />
                        <div className="h-3 w-full animate-pulse rounded bg-[#e9e6dd]" />
                        <div className="h-3 w-2/3 animate-pulse rounded bg-[#e9e6dd]" />
                      </>
                    ) : (
                      <>
                        {format !== "story" && <p className="font-serif text-[17px] leading-tight">{headline}</p>}
                        <p className="text-[#4f4d48]">
                          <span className="font-semibold text-[#2b2a27]">root.protein</span> {format === "story" ? current.angle : sub} — {aud.line}.
                        </p>
                        <p className="text-[12px]" style={{ color: MOSS }}>{hashtags}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Recipe cards */}
            <div>
              <div className="mb-2 flex items-baseline justify-between">
                <h3 className="text-sm font-medium">Concepts</h3>
                <span className="text-xs text-[#6b6862]">Arrow keys to switch</span>
              </div>
              <div role="radiogroup" aria-label="Creative concept" className="grid grid-cols-3 gap-3 max-[400px]:-mx-4 max-[400px]:flex max-[400px]:overflow-x-auto max-[400px]:px-4 max-[400px]:pb-1">
                {CONCEPTS.map((c, i) => {
                  const selected = c.id === concept;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      tabIndex={selected ? 0 : -1}
                      ref={(el) => {
                        cardRefs.current[i] = el;
                      }}
                      onClick={() => pick(c.id)}
                      onKeyDown={(e) => onCardKey(e, i)}
                      className={`relative flex min-w-[150px] flex-col gap-2 rounded-[10px] border bg-white p-3 text-left transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-16px_rgba(43,42,39,0.5)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${ring} ${
                        selected ? "border-[#c9c5ba] border-t-[3px]" : "border-[#d9d6cd]"
                      }`}
                      style={selected ? { borderTopColor: TERRACOTTA } : undefined}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#6b6862]">{c.id}</span>
                        {selected && <Check className="size-4" style={{ color: TERRACOTTA }} aria-hidden />}
                      </div>
                      <span className="text-sm font-medium leading-tight">{c.name}</span>
                      <span className="text-xs text-[#6b6862]">{c.angle}</span>
                      <span className="mt-1 h-2 w-full rounded-full" style={{ background: `linear-gradient(90deg, ${c.hue[0]}, ${c.hue[1]})` }} aria-hidden />
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* RIGHT: form */}
          <section aria-labelledby="setup-heading" className="relative flex flex-col">
            <h2 id="setup-heading" className="sr-only">Campaign setup</h2>

            {/* Brief */}
            <div className="border-b border-[#d9d6cd] pb-5">
              <div className="flex items-baseline justify-between">
                <label htmlFor="bc-brief" className="text-sm font-medium">Brief</label>
                <span className="text-xs tabular-nums text-[#6b6862]">{brief.length} / {BRIEF_MAX}</span>
              </div>
              <textarea
                id="bc-brief"
                value={brief}
                maxLength={BRIEF_MAX}
                rows={4}
                aria-invalid={error !== null}
                aria-describedby="bc-brief-help bc-brief-error"
                onChange={(e) => {
                  setBrief(e.target.value);
                  if (error) setError(null);
                }}
                onBlur={() => log("Brief updated")}
                className={`mt-2 w-full resize-none rounded-[10px] border bg-white px-3 py-2.5 text-sm leading-relaxed placeholder:text-[#9a978f] ${ring} ${
                  error ? "border-[#b4462b]" : "border-[#c9c5ba]"
                }`}
                placeholder="What are we launching, for whom, and what should they feel?"
              />
              <p id="bc-brief-help" className="mt-1.5 text-xs text-[#6b6862]">Product, audience, and the one thing to remember. At least {BRIEF_MIN} characters.</p>
              {error && (
                <p id="bc-brief-error" role="alert" className="mt-2 flex items-start gap-2 rounded-[10px] border border-[#e6b8a8] bg-[#fbeee9] px-3 py-2 text-xs text-[#8a3419]">
                  <AlertCircle className="mt-px size-3.5 shrink-0" aria-hidden />
                  <span>
                    {error}{" "}
                    <button type="button" onClick={generate} className={`font-medium underline underline-offset-2 ${ring}`}>Retry</button>
                  </span>
                </p>
              )}
            </div>

            {/* Audience */}
            <fieldset className="border-b border-[#d9d6cd] py-5">
              <legend className="text-sm font-medium">Audience</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {AUDIENCES.map((a) => {
                  const Icon = a.icon;
                  const on = audience === a.id;
                  return (
                    <button
                      key={a.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => {
                        setAudience(a.id);
                        log(`Audience → ${a.label}`);
                      }}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${ring} ${
                        on ? "border-[#5b6b4e] bg-[#5b6b4e] text-white" : "border-[#c9c5ba] bg-white text-[#4f4d48] hover:bg-[#f0eee8]"
                      }`}
                    >
                      <Icon className="size-3.5" aria-hidden />
                      {a.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Channel + Tone */}
            <div className="grid gap-5 border-b border-[#d9d6cd] py-5 sm:grid-cols-2">
              <div>
                <label htmlFor="bc-channel" className="text-sm font-medium">Channel</label>
                <div className="relative mt-2">
                  <select
                    id="bc-channel"
                    value={channel}
                    onChange={(e) => {
                      const v = e.target.value as Channel;
                      setChannel(v);
                      log(`Channel → ${CHANNELS.find((c) => c.id === v)!.label}`);
                    }}
                    className={`w-full appearance-none rounded-[10px] border border-[#c9c5ba] bg-white py-2 pl-3 pr-9 text-sm ${ring}`}
                  >
                    {CHANNELS.map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#6b6862]" aria-hidden />
                </div>
              </div>
              <fieldset>
                <legend className="text-sm font-medium">Tone</legend>
                <div role="radiogroup" aria-label="Tone" className="mt-2 grid grid-cols-3 rounded-[10px] border border-[#c9c5ba] bg-white p-1 text-xs">
                  {TONES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      role="radio"
                      aria-checked={tone === t.id}
                      onClick={() => {
                        setTone(t.id);
                        log(`Tone → ${t.label}`);
                      }}
                      className={`rounded-[7px] py-1.5 font-medium transition-colors ${ring} ${tone === t.id ? "bg-[#2b2a27] text-white" : "text-[#4f4d48] hover:bg-[#f0eee8]"}`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>

            {/* Visual style */}
            <fieldset className="border-b border-[#d9d6cd] py-5">
              <legend className="text-sm font-medium">Visual style</legend>
              <div role="radiogroup" aria-label="Visual style" className="mt-2 flex flex-wrap gap-3">
                {STYLES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    role="radio"
                    aria-checked={style === s.id}
                    onClick={() => {
                      setStyle(s.id);
                      log(`Style → ${s.label}`);
                    }}
                    className={`group flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 text-xs transition-colors ${ring} ${
                      style === s.id ? "border-[#2b2a27] bg-white" : "border-[#c9c5ba] bg-white hover:bg-[#f0eee8]"
                    }`}
                  >
                    <span className="size-6 rounded-full border border-black/10" style={{ background: s.swatch }} aria-hidden />
                    {s.label}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Forecast */}
            <div className="border-b border-[#d9d6cd] py-5">
              <h3 className="text-sm font-medium">Forecast</h3>
              <dl className="mt-3 space-y-3">
                {forecast.map((row) => (
                  <div key={row.label} className="grid grid-cols-[1fr_auto_auto] items-end gap-4">
                    <dt className="text-sm text-[#4f4d48]">{row.label}</dt>
                    <dd className="text-sm font-semibold tabular-nums">{row.value}</dd>
                    <dd className="flex h-6 items-end gap-[3px]" aria-hidden>
                      {row.bars.map((h, i) => (
                        <span key={i} className="w-1.5 rounded-sm transition-[height] duration-300 motion-reduce:transition-none" style={{ height: `${h * 100}%`, background: MOSS, opacity: 0.45 + i * 0.07 }} />
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-xs text-[#6b6862]">
                {ch.label} weight · reach ×{ch.reach} · CTR ×{ch.ctr} · conversion ×{ch.conv}. Concept {current.id} baseline.
              </p>
            </div>

            {/* Recent */}
            <div className="py-5">
              <h3 className="text-sm font-medium">Recent</h3>
              <ol className="mt-3 space-y-0">
                {activity.map((a, i) => (
                  <li key={a.id} className="relative flex gap-3 pb-3 text-sm">
                    <span className="relative mt-1.5 flex w-3 shrink-0 justify-center">
                      <span className="size-2 rounded-full" style={{ background: i === 0 ? TERRACOTTA : MOSS }} aria-hidden />
                      {i < activity.length - 1 && <span className="absolute top-3 h-[calc(100%+4px)] w-px bg-[#d9d6cd]" aria-hidden />}
                    </span>
                    <span className="flex-1 text-[#2b2a27]">{a.text}</span>
                    <time className="text-xs text-[#6b6862]" dateTime={new Date(a.at).toISOString()}>{relativeTime(a.at, now)}</time>
                  </li>
                ))}
              </ol>
            </div>

            {/* Actions */}
            <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[#d9d6cd] bg-[#f7f6f2]/95 px-4 py-3 backdrop-blur lg:sticky lg:inset-x-auto lg:mt-auto lg:border-t lg:px-0">
              <div className="mx-auto flex max-w-[1280px] items-center gap-2 lg:max-w-none">
                <button
                  type="button"
                  onClick={generate}
                  disabled={loading}
                  aria-busy={loading}
                  className={`inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-[10px] px-4 text-sm font-medium text-white transition-colors hover:bg-[#4c5a41] disabled:cursor-progress disabled:opacity-80 lg:flex-none ${ring}`}
                  style={{ background: MOSS }}
                >
                  {loading ? <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden /> : null}
                  {loading ? "Generating…" : "Generate"}
                </button>
                <button
                  type="button"
                  onClick={save}
                  className={`inline-flex h-10 items-center gap-1.5 rounded-[10px] border border-[#c9c5ba] bg-white px-4 text-sm font-medium transition-colors hover:bg-[#f0eee8] ${ring}`}
                >
                  {saved && <Check className="size-4" style={{ color: MOSS }} aria-hidden />}
                  {saved ? "Saved" : "Save"}
                </button>
                <div ref={exportRef} className="relative">
                  <button
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={exportOpen}
                    onClick={() => setExportOpen((o) => !o)}
                    className={`inline-flex h-10 items-center gap-1 rounded-[10px] border border-[#c9c5ba] bg-white px-4 text-sm font-medium transition-colors hover:bg-[#f0eee8] ${ring}`}
                  >
                    Export
                    <ChevronDown className={`size-4 transition-transform ${exportOpen ? "rotate-180" : ""}`} aria-hidden />
                  </button>
                  {exportOpen && (
                    <div role="menu" className="absolute bottom-full right-0 mb-2 w-40 overflow-hidden rounded-[10px] border border-[#c9c5ba] bg-white py-1 text-sm shadow-lg">
                      <button type="button" role="menuitem" onClick={() => exportAs("PNG")} className={`flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-[#f0eee8] ${ring}`}>
                        <FileImage className="size-4 text-[#6b6862]" aria-hidden /> PNG
                      </button>
                      <button type="button" role="menuitem" onClick={() => exportAs("PDF")} className={`flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-[#f0eee8] ${ring}`}>
                        <FileText className="size-4 text-[#6b6862]" aria-hidden /> PDF
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Status for screen readers + toast */}
      <p className="sr-only" aria-live="polite">{loading ? "Generating concept" : error ? error : toast ?? ""}</p>
      {toast && (
        <div className="pointer-events-none fixed right-4 top-4 z-30 flex items-center gap-2 rounded-[10px] px-3.5 py-2.5 text-sm font-medium text-white shadow-lg" style={{ background: MOSS }}>
          <Check className="size-4" aria-hidden />
          {toast}
        </div>
      )}
    </div>
  );
}
