"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, Check, Footprints, Mountain, Timer, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------------------------------- data ---------------------------------- */

type ConceptId = "A" | "B" | "C";
type Status = "idle" | "loading" | "success" | "error";

const BLACK = "#0a0a0a";

const CONCEPTS: Record<
  ConceptId,
  { name: string; color: string; onColor: string; lines: [string, string, string]; reach: number; ctr: number; conv: number }
> = {
  A: { name: "Endurance", color: "#c6ff3d", onColor: BLACK, lines: ["Thirty", "days.", "One charge."], reach: 2_400_000, ctr: 1.9, conv: 1.4 },
  B: { name: "Night grid", color: "#39e0ff", onColor: BLACK, lines: ["Run", "past", "the grid."], reach: 1_900_000, ctr: 2.6, conv: 1.8 },
  C: { name: "Pulse", color: "#ff4fa3", onColor: BLACK, lines: ["Pace", "is a", "feeling."], reach: 2_100_000, ctr: 2.2, conv: 2.1 },
};

const AUDIENCES = [
  { id: "trail", label: "Trail runners", note: "Weekend elevation", Icon: Mountain },
  { id: "marathon", label: "Marathon trainers", note: "16-week blocks", Icon: Timer },
  { id: "ultra", label: "Ultra endurance", note: "50K and beyond", Icon: TrendingUp },
  { id: "daily", label: "Everyday joggers", note: "5K before work", Icon: Footprints },
] as const;

const CHANNELS = [
  { id: "story", label: "Instagram Stories", format: "Story 9:16", ratio: 9 / 16, cta: "Swipe up", reach: 1, ctr: 1 },
  { id: "feed", label: "Instagram Feed", format: "Feed 4:5", ratio: 4 / 5, cta: "Shop now", reach: 1.3, ctr: 0.8 },
  { id: "display", label: "Programmatic display", format: "Display 300×250", ratio: 6 / 5, cta: "Learn more", reach: 2.4, ctr: 0.3 },
] as const;

const TONES = ["Calm", "Driven", "Relentless"] as const;
const TONE_STAT: Record<(typeof TONES)[number], string> = {
  Calm: "30 days. No cable.",
  Driven: "30-day battery",
  Relentless: "720 hours. Zero excuses.",
};

const STYLES = [
  { id: "neon", label: "Neon night", swatch: "linear-gradient(135deg,#0a0a0a 40%,#3a3a3a)" },
  { id: "concrete", label: "Concrete", swatch: "linear-gradient(135deg,#6b6b6b,#2b2b2b)" },
  { id: "dawn", label: "Dawn haze", swatch: "linear-gradient(135deg,#f5e6d8,#a68a7a)" },
  { id: "topo", label: "Topographic", swatch: "repeating-radial-gradient(circle at 30% 30%,#1a1a1a 0 6px,#2e2e2e 6px 8px)" },
] as const;

type AudienceId = (typeof AUDIENCES)[number]["id"];
type ChannelId = (typeof CHANNELS)[number]["id"];
type StyleId = (typeof STYLES)[number]["id"];

type LogEntry = { id: number; time: string; text: string };
const SEED_LOG: LogEntry[] = [
  { id: 2, time: "12:41", text: "concept → A" },
  { id: 1, time: "12:38", text: "brief · drafted" },
];

const clock = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const stamp = () => Date.now();
const jitter = () => Math.random() * 0.12 - 0.04;
const fmtReach = (n: number) => (n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}` : `${Math.round(n / 1000)}`);

const RING_R = 44;
const RING_C = 2 * Math.PI * RING_R;
const MIN_BRIEF = 24;

const focusOnBlack = "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--fi-accent)";

/* ---------------------------------- page ---------------------------------- */

export default function VisualImpeccable() {
  const [brief, setBrief] = useState(
    "Tempo is a GPS running watch with a 30-day battery. Sell freedom from charging to runners who train every day.",
  );
  const [briefTouched, setBriefTouched] = useState(false);
  const [audience, setAudience] = useState<AudienceId>("marathon");
  const [channel, setChannel] = useState<ChannelId>("story");
  const [toneIdx, setToneIdx] = useState(1);
  const [style, setStyle] = useState<StyleId>("neon");
  const [concept, setConcept] = useState<ConceptId>("A");
  const [status, setStatus] = useState<Status>("idle");
  const [boost, setBoost] = useState(0);
  const [rendered, setRendered] = useState(false);
  const [saved, setSaved] = useState(false);
  const [exportPct, setExportPct] = useState<number | null>(null);
  const [log, setLog] = useState<LogEntry[]>(SEED_LOG);
  const attempts = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const exportTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const pending = timers.current;
    const interval = exportTimer;
    return () => {
      pending.forEach(clearTimeout);
      if (interval.current) clearInterval(interval.current);
    };
  }, []);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  };
  const note = (text: string) => setLog((prev) => [{ id: stamp(), time: clock(), text }, ...prev].slice(0, 10));

  const c = CONCEPTS[concept];
  const ch = CHANNELS.find((x) => x.id === channel)!;
  const tone = TONES[toneIdx];
  const toneFactor = 0.94 + toneIdx * 0.06;
  const reach = Math.round(c.reach * ch.reach * (1 + boost));
  const ctr = c.ctr * ch.ctr * toneFactor * (1 + boost);
  const conv = c.conv * toneFactor * (style === "dawn" ? 0.95 : 1) * (1 + boost);
  const convMax = 3.5;
  const ringOffset = RING_C * (1 - Math.min(conv / convMax, 1));
  const briefLen = brief.trim().length;
  const briefInvalid = briefLen < MIN_BRIEF;
  const showBriefError = (briefTouched || status === "error") && briefInvalid;
  const errorCount = status === "error" ? 1 : 0;
  const loading = status === "loading";

  const pickConcept = (id: ConceptId) => {
    if (id === concept) return;
    setConcept(id);
    note(`concept → ${id}`);
  };

  // Error rule: a brief shorter than MIN_BRIEF characters fails deterministically;
  // otherwise every 4th render attempt fails with a simulated pipeline error.
  const generate = () => {
    if (loading) return;
    attempts.current += 1;
    const attempt = attempts.current;
    setStatus("loading");
    setRendered(false);
    note(`render → ${concept} · ${ch.format}`);
    later(() => {
      if (briefInvalid) {
        setStatus("error");
        setBriefTouched(true);
        note("render ✕ brief too short");
        return;
      }
      if (attempt % 4 === 0) {
        setStatus("error");
        note("render ✕ pipeline timeout");
        return;
      }
      setStatus("success");
      setBoost(jitter());
      setRendered(true);
      note(`render ✓ ${concept} · ${fmtReach(reach)}M reach`);
      later(() => setRendered(false), 2000);
    }, 1600);
  };

  const save = () => {
    setSaved(true);
    note("saved · campaign draft");
    later(() => setSaved(false), 1500);
  };

  const exportFile = () => {
    if (exportPct !== null) return;
    setExportPct(0);
    note(`export → ${ch.format} · PNG`);
    exportTimer.current = setInterval(() => {
      setExportPct((p) => (p === null ? null : Math.min(100, p + 8)));
    }, 90);
    later(() => {
      if (exportTimer.current) clearInterval(exportTimer.current);
      exportTimer.current = null;
    }, 1300);
    later(() => setExportPct(null), 3600);
  };

  const sectionHead = (n: string, title: string, extra?: React.ReactNode) => (
    <h2 className="sticky top-[53px] z-10 -mx-5 flex items-center gap-3 border-b border-white/10 bg-[#0a0a0a]/95 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-white/70 backdrop-blur sm:-mx-8 sm:px-8">
      <span className="font-mono" style={{ color: c.color }}>
        {n}
      </span>
      {title}
      {extra}
    </h2>
  );

  const statusLine =
    status === "loading"
      ? "Rendering…"
      : status === "success"
        ? `Rendered · ${fmtReach(reach)}M reach`
        : status === "error"
          ? briefInvalid
            ? `Brief needs ${MIN_BRIEF - briefLen} more characters`
            : "Pipeline timed out — retry"
          : `${c.name} · ${ch.format}`;

  return (
    <div
      className="min-h-screen bg-[#0a0a0a] font-sans text-white antialiased"
      style={{ "--fi-accent": c.color } as React.CSSProperties}
    >
      <style>{`
        @keyframes fable-vi-scan { from { top: -4px } to { top: 100% } }
        .fable-vi-scan { animation: fable-vi-scan 1.6s linear infinite }
        @media (prefers-reduced-motion: reduce) { .fable-vi-scan { animation: none; top: 50% } .fable-vi-ring { transition: none } }
      `}</style>

      {/* Header strip */}
      <header className="sticky top-0 z-20 flex h-[53px] items-center gap-3 border-b border-white/10 bg-[#0a0a0a] px-5 sm:px-8">
        <h1 className="flex items-baseline gap-2">
          <span className="text-lg font-black uppercase tracking-tight">Muse</span>
          <span className="hidden text-xs uppercase tracking-[0.2em] text-white/50 sm:inline">Visual + Impeccable</span>
        </h1>
        <div className="ml-auto flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide">
          <span className="rounded-sm bg-white px-2 py-1 text-black">Fable 5.1</span>
          <span className="rounded-sm px-2 py-1 text-black" style={{ background: c.color }}>
            frontend-skill + impeccable
          </span>
        </div>
      </header>

      <p aria-live="polite" className="sr-only">
        {statusLine}
      </p>

      <div className="lg:grid lg:grid-cols-2">
        {/* LEFT — stage */}
        <section
          aria-label="Creative stage"
          className="flex flex-col items-center justify-center gap-5 border-b border-white/10 px-5 py-8 lg:sticky lg:top-[53px] lg:h-[calc(100dvh_-_53px)] lg:border-b-0 lg:border-r [--fi-stage-h:70vh] lg:[--fi-stage-h:calc(100dvh_-_53px_-_11rem)]"
        >
          <div
            className={cn(
              "relative overflow-hidden rounded-sm bg-black transition-[width] duration-300",
              status === "error" && "outline outline-2 outline-red-500",
            )}
            style={{
              aspectRatio: ch.ratio,
              width: `min(100%, calc(var(--fi-stage-h) * ${ch.ratio}))`,
              backgroundImage: `linear-gradient(160deg, ${c.color} 0 46%, ${BLACK} 46% 100%)`,
            }}
          >
            {style !== "neon" && (
              <div aria-hidden="true" className="absolute inset-0 opacity-30 mix-blend-overlay" style={{ background: STYLES.find((s) => s.id === style)!.swatch }} />
            )}
            {loading && (
              <div aria-hidden="true" className="fable-vi-scan absolute inset-x-0 h-1" style={{ background: c.color, boxShadow: `0 0 24px 4px ${c.color}` }} />
            )}
            {rendered && (
              <span className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-sm px-2 py-1 text-[11px] font-bold uppercase" style={{ background: c.color, color: c.onColor }}>
                <Check className="size-3" aria-hidden="true" /> Rendered
              </span>
            )}
            <div className="relative flex h-full flex-col p-5 sm:p-7">
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-black/70">Tempo</span>
                <svg viewBox="0 0 100 100" className="size-16 sm:size-20" role="img" aria-label={`Conversion ${conv.toFixed(2)} percent`}>
                  <circle cx="50" cy="50" r={RING_R} fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="6" />
                  <circle
                    cx="50"
                    cy="50"
                    r={RING_R}
                    fill="none"
                    stroke={BLACK}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={RING_C}
                    strokeDashoffset={ringOffset}
                    transform="rotate(-90 50 50)"
                    className="fable-vi-ring transition-[stroke-dashoffset] duration-700 ease-out"
                  />
                  <text x="50" y="55" textAnchor="middle" className="fill-black font-mono text-[16px] font-bold">
                    {conv.toFixed(1)}
                  </text>
                </svg>
              </div>
              <div className={cn("mt-auto", ch.id === "display" && "mt-2")}>
                <span className="inline-block rounded-sm bg-black px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: c.color }}>
                  {TONE_STAT[tone]}
                </span>
                <h2
                  className={cn(
                    "mt-3 font-bold uppercase leading-[0.9] tracking-tight text-white",
                    ch.id === "display" ? "text-[clamp(22px,4vw,40px)]" : "text-[clamp(36px,7vw,72px)]",
                  )}
                  style={{ textShadow: "0 2px 0 rgba(0,0,0,0.35)" }}
                >
                  {c.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </h2>
                <p className="mt-3 text-[11px] uppercase tracking-[0.15em] text-white/60">
                  For {AUDIENCES.find((a) => a.id === audience)!.label.toLowerCase()} · {tone}
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between rounded-sm px-3 py-2 text-xs font-bold uppercase tracking-[0.2em]" style={{ background: c.color, color: c.onColor }}>
                {ch.cta}
                <span aria-hidden="true">↑</span>
              </div>
            </div>
          </div>

          <div className="flex w-full max-w-md items-center justify-between gap-4">
            <div role="group" aria-label="Concept" className="flex gap-2">
              {(Object.keys(CONCEPTS) as ConceptId[]).map((id) => {
                const on = id === concept;
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => pickConcept(id)}
                    className={cn(
                      "size-10 rounded-sm border text-sm font-black transition-colors",
                      on ? "border-transparent" : "border-white/25 text-white hover:border-white",
                      focusOnBlack,
                    )}
                    style={on ? { background: CONCEPTS[id].color, color: CONCEPTS[id].onColor } : undefined}
                  >
                    {id}
                  </button>
                );
              })}
            </div>
            <span className="font-mono text-xs uppercase tracking-wider text-white/60">{ch.format}</span>
          </div>
        </section>

        {/* RIGHT — sections */}
        <div className="px-5 pb-32 sm:px-8 lg:pb-10">
          <section className="pb-8">
            {sectionHead(
              "01",
              "Brief",
              errorCount > 0 && (
                <span className="ml-auto flex items-center gap-1 rounded-sm bg-red-500 px-1.5 py-0.5 font-mono text-[10px] text-white">
                  <AlertCircle className="size-3" aria-hidden="true" />
                  {errorCount}
                </span>
              ),
            )}
            <label htmlFor="vi-brief" className="sr-only">
              Campaign brief
            </label>
            <textarea
              id="vi-brief"
              value={brief}
              rows={4}
              onChange={(e) => setBrief(e.target.value)}
              onBlur={() => setBriefTouched(true)}
              aria-invalid={showBriefError}
              aria-describedby="vi-brief-meta"
              className={cn(
                "mt-4 w-full resize-y rounded-sm border bg-white/5 p-3 text-sm leading-relaxed text-white placeholder:text-white/40",
                showBriefError ? "border-red-500" : "border-white/20 hover:border-white/40",
                focusOnBlack,
              )}
              placeholder="What is Tempo, and who needs it?"
            />
            <div id="vi-brief-meta" className="mt-1.5 flex justify-between font-mono text-[11px] text-white/50">
              <span className={cn(showBriefError && "text-red-400")}>
                {showBriefError ? `Minimum ${MIN_BRIEF} characters` : "Plain language. One product, one promise."}
              </span>
              <span className={cn("tabular-nums", showBriefError && "text-red-400")}>{briefLen}</span>
            </div>
          </section>

          <section className="pb-8">
            {sectionHead("02", "Audience")}
            <div role="radiogroup" aria-label="Target audience" className="mt-4 grid grid-cols-2 gap-2">
              {AUDIENCES.map(({ id, label, note: hint, Icon }) => {
                const on = id === audience;
                return (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => {
                      if (on) return;
                      setAudience(id);
                      note(`audience → ${label}`);
                    }}
                    className={cn(
                      "flex flex-col items-start gap-3 rounded-sm border p-3 text-left transition-colors sm:p-4",
                      on ? "bg-white/10" : "border-white/15 hover:border-white/50",
                      focusOnBlack,
                    )}
                    style={on ? { borderColor: c.color } : undefined}
                  >
                    <Icon className="size-5" style={on ? { color: c.color } : undefined} aria-hidden="true" />
                    <span>
                      <span className="block text-sm font-bold uppercase tracking-tight">{label}</span>
                      <span className="block text-xs text-white/50">{hint}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="pb-8">
            {sectionHead("03", "Channel")}
            <div role="radiogroup" aria-label="Channel" className="mt-4 grid gap-2 sm:grid-cols-3">
              {CHANNELS.map((x) => {
                const on = x.id === channel;
                return (
                  <button
                    key={x.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => {
                      if (on) return;
                      setChannel(x.id);
                      note(`channel → ${x.format}`);
                    }}
                    className={cn(
                      "flex items-center justify-between gap-2 rounded-sm border px-3 py-2.5 text-left text-sm transition-colors",
                      on ? "bg-white/10" : "border-white/15 hover:border-white/50",
                      focusOnBlack,
                    )}
                    style={on ? { borderColor: c.color } : undefined}
                  >
                    <span className="font-bold uppercase tracking-tight">{x.label}</span>
                    <span className="font-mono text-[11px] text-white/50">{x.format}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="pb-8">
            {sectionHead("04", "Tone")}
            <label htmlFor="vi-tone" className="sr-only">
              Tone
            </label>
            <input
              id="vi-tone"
              type="range"
              min={0}
              max={2}
              step={1}
              value={toneIdx}
              onChange={(e) => {
                const v = Number(e.target.value);
                setToneIdx(v);
                note(`tone → ${TONES[v]}`);
              }}
              className={cn("mt-6 w-full cursor-pointer rounded-sm", focusOnBlack)}
              style={{ accentColor: c.color }}
              aria-valuetext={tone}
            />
            <div className="mt-2 flex justify-between font-mono text-[11px] uppercase tracking-wider">
              {TONES.map((t, i) => (
                <span key={t} className={i === toneIdx ? "text-white" : "text-white/40"} style={i === toneIdx ? { color: c.color } : undefined}>
                  {t}
                </span>
              ))}
            </div>
          </section>

          <section className="pb-8">
            {sectionHead("05", "Style")}
            <div role="radiogroup" aria-label="Visual style" className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {STYLES.map((s) => {
                const on = s.id === style;
                return (
                  <button
                    key={s.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => {
                      if (on) return;
                      setStyle(s.id);
                      note(`style → ${s.label}`);
                    }}
                    className={cn("group rounded-sm border p-1.5 text-left transition-colors", on ? "" : "border-white/15 hover:border-white/50", focusOnBlack)}
                    style={on ? { borderColor: c.color } : undefined}
                  >
                    <span aria-hidden="true" className="block aspect-[4/3] rounded-sm" style={{ background: s.swatch }} />
                    <span className="mt-1.5 block px-0.5 text-xs font-bold uppercase tracking-tight">{s.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="pb-8">
            {sectionHead("06", "Forecast")}
            <dl className="mt-4 grid grid-cols-3 gap-4">
              {[
                { label: "Reach", value: fmtReach(reach), unit: "M", pct: reach / 6_000_000 },
                { label: "CTR", value: ctr.toFixed(2), unit: "%", pct: ctr / 5 },
                { label: "Conversion", value: conv.toFixed(2), unit: "%", pct: conv / convMax },
              ].map((m) => (
                <div key={m.label}>
                  <dt className="text-[11px] uppercase tracking-[0.2em] text-white/50">{m.label}</dt>
                  <dd className="m-0 mt-1 flex items-baseline gap-1 font-mono">
                    <span className="text-2xl font-bold tabular-nums sm:text-3xl">{m.value}</span>
                    <span className="text-xs text-white/50">{m.unit}</span>
                  </dd>
                  <div className="mt-2 h-1 w-full rounded-full bg-white/10">
                    <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${Math.min(100, m.pct * 100)}%`, background: c.color }} />
                  </div>
                </div>
              ))}
            </dl>
          </section>

          <section className="pb-8">
            {sectionHead("07", "Activity")}
            <ol className="mt-4 grid gap-1.5 font-mono text-xs text-white/70">
              {log.map((e) => (
                <li key={e.id} className="flex gap-3">
                  <span className="tabular-nums text-white/40">{e.time}</span>
                  <span aria-hidden="true">·</span>
                  <span>{e.text}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* Action block: inline on desktop, sticky bottom bar under lg */}
          <div className="fixed inset-x-0 bottom-0 z-20 border-t border-white/10 bg-[#0a0a0a]/95 px-5 py-3 backdrop-blur lg:static lg:border-0 lg:bg-transparent lg:p-0 lg:pt-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={generate}
                disabled={loading}
                aria-busy={loading}
                className="h-12 flex-1 rounded-sm text-sm font-black uppercase tracking-[0.15em] transition-opacity outline-none hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:opacity-60 lg:h-14 lg:text-base"
                style={{ background: c.color, color: c.onColor }}
              >
                {loading ? "Rendering…" : status === "error" ? "Retry" : "Generate"}
              </button>
              <button
                type="button"
                onClick={save}
                className={cn("h-12 rounded-sm border border-white/30 px-4 text-sm font-bold uppercase tracking-wide transition-colors hover:border-white lg:h-14", focusOnBlack)}
              >
                {saved ? "Saved" : "Save"}
              </button>
              <button
                type="button"
                onClick={exportFile}
                disabled={exportPct !== null && exportPct < 100}
                className={cn("relative h-12 overflow-hidden rounded-sm border border-white/30 px-4 font-mono text-sm font-bold uppercase tracking-wide transition-colors hover:border-white disabled:opacity-80 lg:h-14", focusOnBlack)}
              >
                {exportPct !== null && exportPct < 100 && (
                  <span aria-hidden="true" className="absolute inset-y-0 left-0 opacity-30" style={{ width: `${exportPct}%`, background: c.color }} />
                )}
                <span className="relative">{exportPct === null ? "Export" : exportPct < 100 ? `${exportPct}%` : "Ready"}</span>
              </button>
            </div>
            <p className="mt-2 truncate font-mono text-[11px] text-white/50 lg:mt-3">{statusLine}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
