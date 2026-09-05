"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Baby, Check, Download, Loader2, Pencil, RotateCcw, Save, School, Sprout, Users, WandSparkles, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------------------------------- data ---------------------------------- */

type ConceptId = "A" | "B" | "C";
type Status = "idle" | "loading" | "success" | "error";
type Metrics = { reach: number; ctr: number; conv: number };
type Activity = { id: number; text: string; time: string };

const GREEN = "#0f3d2e";
const CORAL = "#ff6b4a";
const MINT = "#d9f2e6";
const CREAM = "#fffdf7";

const AUDIENCES: { id: string; label: string; hint: string; icon: LucideIcon; badge: string }[] = [
  { id: "toddlers", label: "Parents of toddlers", hint: "Ages 2–5 · first screen", icon: Baby, badge: "Ages 2–5" },
  { id: "school", label: "School-age families", hint: "Ages 6–11 · homework & reading", icon: School, badge: "Ages 6–11" },
  { id: "educators", label: "Classrooms & educators", hint: "Bulk sets · shared devices", icon: Users, badge: "For classrooms" },
];

const CHANNELS = ["Instagram", "YouTube", "Parenting newsletters", "Retail display"];
const TONES: { id: string; label: string; hint: string }[] = [
  { id: "reassuring", label: "Reassuring", hint: "Calm, parent-to-parent" },
  { id: "playful", label: "Playful", hint: "Bouncy, kid-facing" },
  { id: "plain", label: "Matter-of-fact", hint: "Specs first, no fluff" },
];
const STYLES = [
  { id: "paper", name: "Paper", color: "#f3ead8" },
  { id: "meadow", name: "Meadow", color: "#9bd6b0" },
  { id: "sky", name: "Sky", color: "#a9d3f2" },
  { id: "sunset", name: "Sunset", color: "#ffb99a" },
];

const CONCEPTS: Record<
  ConceptId,
  { name: string; color: string; ink: string; headline: string; sub: Record<string, string>; base: Metrics; why: [string, string, string] }
> = {
  A: {
    name: "Paper Day",
    color: "#bfe8d1",
    ink: GREEN,
    headline: "A screen that reads like paper.",
    sub: {
      reassuring: "No glare, no blue light, no autoplay. Just the books and games you picked, on a display that rests their eyes.",
      playful: "Draw on it, read on it, drop it (it's fine). Sprout is the tablet that looks like a notebook and acts like one.",
      plain: "E-paper display, 14-hour battery, parent-approved library only. Nothing else gets in.",
    },
    base: { reach: 48_000, ctr: 3.4, conv: 2.1 },
    why: ["Paper-like display is a strong scroll-stopper in feeds", "Parents respond to the eye-comfort claim", "Price shown early reduces drop-off"],
  },
  B: {
    name: "Big Little Learner",
    color: "#ffd97a",
    ink: "#4a3300",
    headline: "Their first tablet. Your first easy yes.",
    sub: {
      reassuring: "Every app is reviewed by real teachers. Every session ends when you say so. Sprout grows with them, one unlock at a time.",
      playful: "Stories, doodles and math that feels like a game. Sprout is the sidekick that never asks for more screen time.",
      plain: "Curated by educators. Time limits enforced on-device. Works offline. Ships with 200 titles.",
    },
    base: { reach: 62_000, ctr: 2.8, conv: 1.7 },
    why: ["Back-to-school timing lifts reach", "Broad 'first tablet' framing lowers click intent", "Teacher-reviewed badge helps conversion"],
  },
  C: {
    name: "Off-Switch Included",
    color: "#b7dcf5",
    ink: "#0b2f4a",
    headline: "The tablet that knows when to stop.",
    sub: {
      reassuring: "Set a bedtime once and Sprout keeps it. Screen dims to paper, then to nothing. No negotiation required.",
      playful: "Plays hard, sleeps on time. Sprout tucks itself in at 7:30 so you don't have to.",
      plain: "Hard schedule limits, per-app caps, weekly report to parents. Not overridable from the device.",
    },
    base: { reach: 41_000, ctr: 4.1, conv: 2.6 },
    why: ["Narrow, specific promise earns high CTR", "Smaller audience than 'first tablet' framing", "Strong intent carries through to checkout"],
  },
};

const CHANNEL_MULT: Record<string, Metrics> = {
  Instagram: { reach: 1, ctr: 1, conv: 1 },
  YouTube: { reach: 1.4, ctr: 0.8, conv: 0.85 },
  "Parenting newsletters": { reach: 0.45, ctr: 1.9, conv: 1.6 },
  "Retail display": { reach: 0.6, ctr: 0.7, conv: 1.3 },
};
const TONE_MULT: Record<string, Metrics> = {
  reassuring: { reach: 1, ctr: 1, conv: 1.08 },
  playful: { reach: 1.06, ctr: 1.12, conv: 0.94 },
  plain: { reach: 0.96, ctr: 0.95, conv: 1.1 },
};
const BASELINE: Metrics = { reach: 45_000, ctr: 3.0, conv: 1.8 };

const INITIAL_ACTIVITY: Activity[] = [
  { id: 3, text: "Concept A generated for Instagram", time: "08:52" },
  { id: 2, text: "Audience set to Parents of toddlers", time: "08:49" },
  { id: 1, text: "Board created: Sprout — Back to school", time: "08:41" },
];

function computeMetrics(concept: ConceptId, channel: string, tone: string, seed: number): Metrics {
  const b = CONCEPTS[concept].base;
  const c = CHANNEL_MULT[channel];
  const t = TONE_MULT[tone];
  const v = 1 + ((seed % 5) - 2) * 0.015;
  return {
    reach: Math.round((b.reach * c.reach * t.reach * v) / 500) * 500,
    ctr: Math.round(b.ctr * c.ctr * t.ctr * v * 10) / 10,
    conv: Math.round(b.conv * c.conv * t.conv * v * 10) / 10,
  };
}

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/* ------------------------------- subcomponents ------------------------------ */

function ColumnHeader({ id, n, name, purpose, children }: { id: string; n: number; name: string; purpose: string; children?: ReactNode }) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white" style={{ backgroundColor: GREEN }} aria-hidden="true">
        {n}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 id={id} className="text-base font-bold tracking-tight">
            {name}
          </h2>
          {children}
        </div>
        <p className="text-[13px] text-[#0f3d2e]/70">{purpose}</p>
      </div>
    </div>
  );
}

function FieldLabel({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#0f3d2e]/70">
      {children}
    </label>
  );
}

function LeafMark({ ink }: { ink: string }) {
  return (
    <svg viewBox="0 0 48 48" className="h-12 w-12" aria-hidden="true">
      <path d="M24 42 C24 30 26 18 40 8 C38 24 32 34 24 42 Z" fill={ink} opacity="0.9" />
      <path d="M24 42 C22 30 18 20 8 12 C10 26 16 36 24 42 Z" fill={ink} opacity="0.55" />
      <path d="M24 42 L24 26" stroke={ink} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f3d2e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffdf7]";

/* ---------------------------------- page ---------------------------------- */

export default function DesignImpeccable() {
  const [title, setTitle] = useState("Sprout — Back to school");
  const [brief, setBrief] = useState(
    "Launch Sprout, a kid-safe tablet with a paper-like display, for the back-to-school window. Speak to parents first, kids second. Lead with eye comfort and the curated library; keep the price visible.",
  );
  const [audience, setAudience] = useState(AUDIENCES[0].id);
  const [channel, setChannel] = useState(CHANNELS[0]);
  const [tone, setTone] = useState(TONES[0].id);
  const [style, setStyle] = useState(STYLES[0].id);
  const [concept, setConcept] = useState<ConceptId>("A");
  const [status, setStatus] = useState<Status>("idle");
  const [errorText, setErrorText] = useState<string | null>(null);
  const [seed, setSeed] = useState(1);
  const [updated, setUpdated] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>("08:52");
  const [exportNote, setExportNote] = useState<string | null>(null);
  const [activity, setActivity] = useState<Activity[]>(INITIAL_ACTIVITY);

  const generateCount = useRef(0);
  const idRef = useRef(100);
  const timers = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  const after = useCallback((ms: number, fn: () => void) => {
    const t = setTimeout(() => {
      timers.current.delete(t);
      fn();
    }, ms);
    timers.current.add(t);
  }, []);

  useEffect(() => {
    const set = timers.current;
    return () => set.forEach(clearTimeout);
  }, []);

  const log = useCallback((text: string) => {
    setActivity((a) => [{ id: ++idRef.current, text, time: nowTime() }, ...a].slice(0, 6));
  }, []);

  const dirty = () => setSavedAt(null);

  /* Error rule: brief shorter than 25 characters fails; otherwise every 4th generate fails. */
  const generate = useCallback(() => {
    if (status === "loading") return;
    generateCount.current += 1;
    setStatus("loading");
    setErrorText(null);
    setUpdated(false);
    log("Generation started");
    after(1600, () => {
      if (brief.trim().length < 25) {
        setStatus("error");
        setErrorText("The brief needs at least 25 characters. Say who it is for and what to lead with.");
        log("Generation stopped: brief too short");
        return;
      }
      if (generateCount.current % 4 === 0) {
        setStatus("error");
        setErrorText("The model returned an empty concept. Your inputs were kept; try again.");
        log("Generation failed: empty response");
        return;
      }
      const next: ConceptId = concept === "A" ? "B" : concept === "B" ? "C" : "A";
      setConcept(next);
      setSeed((s) => s + 1);
      setStatus("success");
      setUpdated(true);
      setSavedAt(null);
      log(`Concept ${next} “${CONCEPTS[next].name}” generated for ${channel}`);
      after(2500, () => setUpdated(false));
    });
  }, [status, brief, concept, channel, after, log]);

  const save = () => {
    setSavedAt(nowTime());
    log("Board saved");
  };

  const exportBoard = () => {
    setExportNote(`Exported ${title}.pdf`);
    log(`Exported concept ${concept} as PDF`);
    after(2500, () => setExportNote(null));
  };

  const pick = (id: ConceptId) => {
    if (id === concept) return;
    setConcept(id);
    setUpdated(false);
    dirty();
    log(`Switched to concept ${id} “${CONCEPTS[id].name}”`);
  };

  const current = CONCEPTS[concept];
  const metrics = computeMetrics(concept, channel, tone, seed);
  const audienceMeta = AUDIENCES.find((a) => a.id === audience)!;
  const styleMeta = STYLES.find((s) => s.id === style)!;
  const loading = status === "loading";
  const isError = status === "error";
  const briefTooShort = brief.trim().length < 25;

  const forecast: { name: string; value: string; delta: number; why: string; tilt: string; paper: string }[] = [
    { name: "Reach", value: `${Math.round(metrics.reach / 1000)}k`, delta: ((metrics.reach - BASELINE.reach) / BASELINE.reach) * 100, why: current.why[0], tilt: "rotate-[1deg]", paper: "#fff3b0" },
    { name: "CTR", value: `${metrics.ctr.toFixed(1)}%`, delta: ((metrics.ctr - BASELINE.ctr) / BASELINE.ctr) * 100, why: current.why[1], tilt: "-rotate-[1deg]", paper: "#ffd6cc" },
    { name: "Conversion", value: `${metrics.conv.toFixed(1)}%`, delta: ((metrics.conv - BASELINE.conv) / BASELINE.conv) * 100, why: current.why[2], tilt: "rotate-[0.6deg]", paper: MINT },
  ];

  const generateButton = (
    <button
      type="button"
      onClick={generate}
      disabled={loading}
      className={cn(
        "inline-flex h-12 w-full items-center justify-center gap-2 rounded-[14px] px-5 text-[15px] font-bold text-white shadow-[0_2px_0_rgba(15,61,46,0.25)] transition-transform hover:-translate-y-px active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 motion-reduce:transition-none",
        FOCUS,
      )}
      style={{ backgroundColor: CORAL }}
    >
      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <WandSparkles className="h-5 w-5" />}
      {loading ? "Working…" : "Generate concept"}
    </button>
  );

  return (
    <div className="min-h-dvh text-[#0f3d2e] antialiased" style={{ backgroundColor: CREAM }}>
      <style>{`
        @keyframes fable-di-stripes { from { background-position: 0 0; } to { background-position: 56px 0; } }
        @keyframes fable-di-flip { from { opacity: 0; transform: translateY(10px) rotate(0deg); } to { opacity: 1; transform: none; } }
        .fable-di-stripes { animation: fable-di-stripes 0.9s linear infinite; }
        .fable-di-flip { animation: fable-di-flip 420ms cubic-bezier(.2,.8,.2,1) both; }
        @media (prefers-reduced-motion: reduce) { .fable-di-stripes, .fable-di-flip { animation: none; } }
      `}</style>

      {/* Top band */}
      <header className="border-b-2 border-[#0f3d2e]/10" style={{ backgroundColor: MINT }}>
        <div className="mx-auto flex max-w-[1480px] flex-col gap-3 px-4 py-4 sm:px-6 min-[1100px]:flex-row min-[1100px]:items-center min-[1100px]:gap-6">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 text-lg font-bold tracking-tight">
              <Sprout className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
              Muse
            </span>
            <span className="h-4 w-px bg-[#0f3d2e]/30" aria-hidden="true" />
            <h1 className="text-[15px] font-bold">Design + Impeccable</h1>
            <span className="rounded-full border-2 border-[#0f3d2e] px-2.5 py-0.5 text-xs font-bold">Fable 5.1</span>
            <span className="rounded-full border-2 border-[#0f3d2e] px-2.5 py-0.5 font-mono text-xs font-medium">frontend-design + impeccable</span>
          </div>
          <div className="flex flex-1 items-center gap-2 min-[1100px]:justify-end">
            <label htmlFor="board-title" className="sr-only">
              Campaign name
            </label>
            <div className="flex w-full max-w-[420px] items-center gap-2 border-b-2 border-[#0f3d2e]/30 focus-within:border-[#0f3d2e]">
              <Pencil className="h-4 w-4 shrink-0 text-[#0f3d2e]/60" aria-hidden="true" />
              <input
                id="board-title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  dirty();
                }}
                className="h-9 w-full bg-transparent text-[15px] font-bold tracking-tight outline-none placeholder:text-[#0f3d2e]/40"
                placeholder="Name this board"
              />
            </div>
          </div>
        </div>
      </header>

      <p className="sr-only" aria-live="polite">
        {loading && "Generating a concept."}
        {status === "success" && `Concept ${concept} ready. Forecast updated.`}
        {isError && "Generation failed. Check the inputs column."}
      </p>

      {/* Board */}
      <main className="mx-auto grid max-w-[1480px] gap-5 px-4 pb-28 pt-5 sm:px-6 min-[720px]:grid-cols-2 min-[720px]:pb-8 min-[1100px]:grid-cols-[1.1fr_2fr_1.1fr_0.9fr]">
        {/* 1 · Inputs */}
        <section aria-labelledby="col-inputs" className="order-2 rounded-[14px] border-2 border-[#0f3d2e]/10 bg-white p-4 min-[720px]:order-1">
          <ColumnHeader id="col-inputs" n={1} name="Inputs" purpose="What we know before we start.">
            {isError && (
              <span className="rounded-full px-2 py-0.5 text-[11px] font-bold text-white" style={{ backgroundColor: CORAL }}>
                Needs attention
              </span>
            )}
          </ColumnHeader>

          <div className="space-y-5">
            <div>
              <FieldLabel htmlFor="di-brief">Brief</FieldLabel>
              <textarea
                id="di-brief"
                value={brief}
                rows={4}
                onChange={(e) => {
                  setBrief(e.target.value);
                  dirty();
                  if (errorText) setErrorText(null);
                }}
                aria-invalid={isError && briefTooShort}
                aria-describedby={errorText ? "di-brief-error" : "di-brief-hint"}
                className={cn(
                  "field-sizing-content min-h-[104px] w-full resize-none rounded-[14px] border-2 bg-[#fffdf7] px-3 py-2.5 text-[14px] leading-relaxed placeholder:text-[#0f3d2e]/40",
                  FOCUS,
                  isError && briefTooShort ? "border-[#ff6b4a]" : "border-[#0f3d2e]/15 hover:border-[#0f3d2e]/30",
                )}
                placeholder="Who is it for, what should it lead with, what must be visible?"
              />
              {errorText ? (
                <p id="di-brief-error" role="alert" className="mt-1.5 text-[13px] font-medium" style={{ color: "#c2410c" }}>
                  {errorText}
                </p>
              ) : (
                <p id="di-brief-hint" className="mt-1.5 text-xs text-[#0f3d2e]/60">
                  {brief.trim().length} characters · grows as you type
                </p>
              )}
            </div>

            <fieldset>
              <legend className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#0f3d2e]/70">Audience</legend>
              <div className="space-y-2">
                {AUDIENCES.map((a) => {
                  const selected = a.id === audience;
                  return (
                    <label
                      key={a.id}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-[14px] border-2 p-3 transition-colors hover:bg-[#d9f2e6]/60 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#0f3d2e] has-[:focus-visible]:ring-offset-2",
                        selected ? "border-[#0f3d2e] bg-[#d9f2e6]/40" : "border-[#0f3d2e]/15",
                      )}
                    >
                      <input
                        type="radio"
                        name="audience"
                        value={a.id}
                        checked={selected}
                        onChange={() => {
                          setAudience(a.id);
                          dirty();
                          log(`Audience set to ${a.label}`);
                        }}
                        className="sr-only"
                      />
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#d9f2e6]">
                        <a.icon className="h-4.5 w-4.5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[14px] font-bold leading-tight">{a.label}</span>
                        <span className="block text-xs text-[#0f3d2e]/60">{a.hint}</span>
                      </span>
                      {selected && <Check className="ml-auto h-4 w-4 shrink-0" aria-hidden="true" />}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div>
              <p id="di-channel" className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#0f3d2e]/70">
                Channel
              </p>
              <div role="group" aria-labelledby="di-channel" className="flex flex-wrap gap-2">
                {CHANNELS.map((c) => {
                  const selected = c === channel;
                  return (
                    <button
                      key={c}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => {
                        setChannel(c);
                        dirty();
                        log(`Channel set to ${c}`);
                      }}
                      className={cn(
                        "rounded-full border-2 px-3 py-1.5 text-[13px] font-bold transition-colors",
                        FOCUS,
                        selected ? "border-[#0f3d2e] bg-[#0f3d2e] text-white" : "border-[#0f3d2e]/15 hover:bg-[#d9f2e6]/60",
                      )}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            <fieldset>
              <legend className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#0f3d2e]/70">Tone</legend>
              <div className="divide-y-2 divide-[#0f3d2e]/10 overflow-hidden rounded-[14px] border-2 border-[#0f3d2e]/15">
                {TONES.map((t) => {
                  const selected = t.id === tone;
                  return (
                    <label key={t.id} className={cn("flex cursor-pointer items-center gap-3 px-3 py-2.5 transition-colors hover:bg-[#d9f2e6]/60 has-[:focus-visible]:bg-[#d9f2e6]", selected && "bg-[#d9f2e6]/40")}>
                      <input
                        type="radio"
                        name="tone"
                        value={t.id}
                        checked={selected}
                        onChange={() => {
                          setTone(t.id);
                          dirty();
                          log(`Tone set to ${t.label}`);
                        }}
                        className="sr-only"
                      />
                      <span className={cn("flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-[#0f3d2e]", selected && "bg-[#0f3d2e]")} aria-hidden="true">
                        {selected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </span>
                      <span className="text-[14px] font-bold">{t.label}</span>
                      <span className="ml-auto text-xs text-[#0f3d2e]/60">{t.hint}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#0f3d2e]/70">Visual style</legend>
              <div className="flex gap-3">
                {STYLES.map((s) => {
                  const selected = s.id === style;
                  return (
                    <label key={s.id} className="flex flex-1 cursor-pointer flex-col items-center gap-1.5 text-center">
                      <input
                        type="radio"
                        name="style"
                        value={s.id}
                        checked={selected}
                        onChange={() => {
                          setStyle(s.id);
                          dirty();
                          log(`Visual style set to ${s.name}`);
                        }}
                        className="peer sr-only"
                      />
                      <span
                        className={cn(
                          "h-10 w-10 rounded-full border-2 transition-transform hover:scale-105 peer-focus-visible:ring-2 peer-focus-visible:ring-[#0f3d2e] peer-focus-visible:ring-offset-2 motion-reduce:transition-none",
                          selected ? "border-[#0f3d2e] ring-2 ring-[#0f3d2e] ring-offset-2" : "border-[#0f3d2e]/20",
                        )}
                        style={{ backgroundColor: s.color }}
                        aria-hidden="true"
                      />
                      <span className={cn("text-xs", selected ? "font-bold" : "text-[#0f3d2e]/70")}>{s.name}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </div>
        </section>

        {/* 2 · Concept */}
        <section aria-labelledby="col-concept" className="order-1 rounded-[14px] border-2 border-[#0f3d2e]/10 bg-white p-4 min-[720px]:order-2">
          <ColumnHeader id="col-concept" n={2} name="Concept" purpose="The creative we are deciding on.">
            {loading && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0f3d2e] px-2.5 py-0.5 text-[11px] font-bold text-white">
                <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" /> Working…
              </span>
            )}
          </ColumnHeader>

          {/* Packaging front */}
          <div
            className="relative overflow-hidden rounded-[14px] border-2 border-[#0f3d2e]/10 p-6 transition-colors duration-300 sm:p-8 min-[1100px]:min-h-[440px]"
            style={{ background: `linear-gradient(160deg, ${current.color} 0%, ${styleMeta.color} 140%)`, color: current.ink }}
          >
            {loading && (
              <div
                aria-hidden="true"
                className="fable-di-stripes absolute inset-0 z-10"
                style={{
                  backgroundImage: "repeating-linear-gradient(135deg, rgba(255,255,255,0.45) 0 14px, transparent 14px 28px)",
                  backgroundSize: "56px 56px",
                }}
              />
            )}
            <div className="flex items-start justify-between">
              <span className="rounded-full border-2 px-3 py-1 text-xs font-bold" style={{ borderColor: current.ink }}>
                {audienceMeta.badge}
              </span>
              <LeafMark ink={current.ink} />
            </div>
            <div className="mt-10 sm:mt-14">
              <p className="text-xs font-bold uppercase tracking-[0.18em] opacity-70">Sprout · {channel}</p>
              <h3 className="mt-3 text-4xl font-bold leading-[1.02] tracking-tight sm:text-5xl min-[1100px]:text-[52px]">{current.headline}</h3>
              <p className="mt-4 max-w-[46ch] text-[15px] font-medium leading-relaxed opacity-85 sm:text-base">{current.sub[tone]}</p>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className="rounded-full px-4 py-2 text-sm font-bold text-white" style={{ backgroundColor: current.ink }}>
                Meet Sprout · $149
              </span>
              <span className="text-xs font-bold opacity-70">{styleMeta.name} palette · Concept {concept}</span>
            </div>
          </div>

          {/* A/B/C */}
          <div role="group" aria-label="Concept" className="mt-4 grid gap-2 sm:grid-cols-3">
            {(["A", "B", "C"] as ConceptId[]).map((id) => {
              const c = CONCEPTS[id];
              const selected = id === concept;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => pick(id)}
                  className={cn(
                    "flex h-12 items-center gap-3 rounded-full border-2 px-4 text-left text-[14px] font-bold transition-colors",
                    FOCUS,
                    selected ? "border-[#0f3d2e] bg-[#0f3d2e] text-white" : "border-[#0f3d2e]/15 hover:bg-[#d9f2e6]/60",
                  )}
                >
                  <span className="h-3.5 w-3.5 shrink-0 rounded-full border-2 border-white/60" style={{ backgroundColor: c.color }} aria-hidden="true" />
                  <span className="truncate">
                    {id} · {c.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 3 · Forecast */}
        <section aria-labelledby="col-forecast" className="order-3 rounded-[14px] border-2 border-[#0f3d2e]/10 bg-white p-4">
          <ColumnHeader id="col-forecast" n={3} name="Forecast" purpose="What the numbers say about it.">
            {updated && <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[11px] font-bold text-white">Updated</span>}
          </ColumnHeader>
          <div className="space-y-4 px-1 pt-1">
            {forecast.map((f, i) => (
              <div
                key={`${f.name}-${seed}`}
                className={cn(
                  "fable-di-flip rounded-sm p-4 shadow-[0_6px_14px_rgba(15,61,46,0.12)] transition-transform duration-200 hover:rotate-0 motion-reduce:rotate-0 motion-reduce:transition-none",
                  f.tilt,
                )}
                style={{ backgroundColor: f.paper, animationDelay: `${i * 70}ms` }}
              >
                <div className="flex items-baseline justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#0f3d2e]/70">{f.name}</p>
                  <span className={cn("text-xs font-bold tabular-nums", f.delta >= 0 ? "text-emerald-700" : "text-[#c2410c]")}>
                    {f.delta >= 0 ? "+" : "−"}
                    {Math.abs(f.delta).toFixed(0)}% vs. baseline
                  </span>
                </div>
                <p className={cn("mt-1 text-4xl font-bold tracking-tight tabular-nums transition-opacity", loading && "opacity-30")}>{f.value}</p>
                <p className="mt-2 text-[13px] leading-snug text-[#0f3d2e]/80">{f.why}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4 · Actions */}
        <section aria-labelledby="col-actions" className="order-4 rounded-[14px] border-2 border-[#0f3d2e]/10 bg-white p-4">
          <ColumnHeader id="col-actions" n={4} name="Actions" purpose="What happens next." />
          <div className="space-y-4">
            <div className="hidden min-[720px]:block">
              {generateButton}
              <p className="mt-1.5 text-xs text-[#0f3d2e]/60">Writes a new concept from the inputs and refreshes the forecast.</p>
            </div>
            {isError && (
              <button
                type="button"
                onClick={generate}
                className={cn("inline-flex h-11 w-full items-center justify-center gap-2 rounded-[14px] border-2 text-[14px] font-bold transition-colors hover:bg-[#ff6b4a]/10", FOCUS)}
                style={{ borderColor: CORAL, color: "#c2410c" }}
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" /> Retry generation
              </button>
            )}
            <div>
              <button
                type="button"
                onClick={save}
                disabled={!!savedAt}
                className={cn(
                  "inline-flex h-11 w-full items-center justify-center gap-2 rounded-[14px] border-2 border-[#0f3d2e] text-[14px] font-bold transition-colors hover:bg-[#d9f2e6]/60 disabled:border-[#0f3d2e]/20 disabled:text-[#0f3d2e]/50",
                  FOCUS,
                )}
              >
                {savedAt ? <Check className="h-4 w-4" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
                {savedAt ? "Saved" : "Save board"}
              </button>
              <p className="mt-1.5 text-xs text-[#0f3d2e]/60">{savedAt ? `Last saved at ${savedAt}.` : "Keeps inputs, concept and forecast together."}</p>
            </div>
            <div>
              <button
                type="button"
                onClick={exportBoard}
                className={cn("inline-flex h-11 w-full items-center justify-center gap-2 rounded-[14px] border-2 border-[#0f3d2e] text-[14px] font-bold transition-colors hover:bg-[#d9f2e6]/60", FOCUS)}
              >
                <Download className="h-4 w-4" aria-hidden="true" /> Export PDF
              </button>
              <p className="mt-1.5 text-xs text-[#0f3d2e]/60">{exportNote ?? "One page: concept front, forecast notes, inputs."}</p>
            </div>

            <div className="border-t-2 border-[#0f3d2e]/10 pt-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f3d2e]/70">Activity</h3>
                <button
                  type="button"
                  onClick={() => setActivity([])}
                  disabled={activity.length === 0}
                  className={cn("rounded px-1 text-xs font-bold text-[#0f3d2e]/70 hover:text-[#0f3d2e] disabled:opacity-40", FOCUS)}
                >
                  Clear
                </button>
              </div>
              {activity.length === 0 ? (
                <p className="text-[13px] text-[#0f3d2e]/60">Nothing yet. Actions will show up here.</p>
              ) : (
                <ol className="space-y-2.5">
                  {activity.map((a) => (
                    <li key={a.id} className="flex items-start gap-2.5 text-[13px] leading-snug">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#0f3d2e] text-white" aria-hidden="true">
                        <Check className="h-2.5 w-2.5" strokeWidth={3} />
                      </span>
                      <span className="flex-1">{a.text}</span>
                      <time className="text-xs tabular-nums text-[#0f3d2e]/60">{a.time}</time>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Sticky mobile bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-[#0f3d2e]/10 p-3 min-[720px]:hidden" style={{ backgroundColor: CREAM, paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}>
        {generateButton}
      </div>
    </div>
  );
}
