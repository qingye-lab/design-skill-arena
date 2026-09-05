"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------------------------------- tokens --------------------------------- */

const PAPER = "#fcfbf9";
const INK = "#23201d";
const BLUSH = "#d9a6a0";
const SAGE = "#9db0a1";
const ERROR = "#b4574d"; // sage-red: sage hue pulled toward red for inline notes

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-[#d9a6a0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fcfbf9]";

/* ---------------------------------- data ---------------------------------- */

type ConceptId = "A" | "B" | "C";
type ControlKey = "audience" | "channel" | "tone" | "style";

const CONTROLS: Record<
  ControlKey,
  { options: readonly string[]; format?: Record<string, string> }
> = {
  audience: {
    options: ["new mothers", "sensitive-skin 30s", "dermatology patients", "skincare minimalists"],
  },
  channel: {
    options: ["Instagram", "Pinterest", "Newsletter", "In-store"],
    format: {
      Instagram: "Post · 4:5",
      Pinterest: "Pin · 2:3",
      Newsletter: "Header · 2:1",
      "In-store": "Shelf card · A5",
    },
  },
  tone: { options: ["gentle", "assured", "clinical", "warm"] },
  style: { options: ["soft studio", "botanical", "clean lab", "film grain"] },
};

const CHANNEL_MULT: Record<string, { reach: number; ctr: number }> = {
  Instagram: { reach: 1, ctr: 1 },
  Pinterest: { reach: 0.72, ctr: 1.35 },
  Newsletter: { reach: 0.18, ctr: 3.2 },
  "In-store": { reach: 0.4, ctr: 0.6 },
};

const TONE_SUB: Record<string, string> = {
  gentle: "A barrier-repair serum that asks nothing of your skin but time.",
  assured: "Barrier repair, measured in mornings. Dew works while you don't.",
  clinical: "Ceramide-3 and panthenol at 4%. Barrier recovery in 14 days.",
  warm: "For skin that has been through a lot. Dew helps it come home.",
};

const CONCEPTS: Record<
  ConceptId,
  { name: string; angle: string; headline: string; tint: string; deep: string; reach: number; ctr: number; conv: number }
> = {
  A: {
    name: "Quiet repair",
    angle: "Barrier science, spoken softly",
    headline: "Skin that remembers calm.",
    tint: "#f3dcd7",
    deep: "#d9a6a0",
    reach: 640_000,
    ctr: 2.1,
    conv: 1.9,
  },
  B: {
    name: "Morning ritual",
    angle: "A pause before the day begins",
    headline: "Begin, again, gently.",
    tint: "#e3e9e2",
    deep: "#9db0a1",
    reach: 520_000,
    ctr: 2.6,
    conv: 2.3,
  },
  C: {
    name: "Clinical glow",
    angle: "Dermatologist-led, data-backed",
    headline: "Proof you can feel.",
    tint: "#efe6d4",
    deep: "#c9b183",
    reach: 780_000,
    ctr: 1.7,
    conv: 1.4,
  },
};

type Entry = { id: number; text: string; when: number | string };

const SEED_ENTRIES: Entry[] = [
  { id: 3, text: "Concept A composed", when: "8 min ago" },
  { id: 2, text: "Channel set to Instagram", when: "12 min ago" },
  { id: 1, text: "Brief drafted", when: "earlier today" },
];

// Wall-clock reads happen only inside event handlers and timers, never during render.
const nowMs = () => Date.now();

const relTime = (when: number | string, now: number) => {
  if (typeof when === "string") return when;
  const s = Math.round((now - when) / 1000);
  if (s < 45) return "just now";
  const m = Math.round(s / 60);
  return m <= 1 ? "1 min ago" : `${m} min ago`;
};
const fmtReach = (n: number) => (n >= 1_000_000 ? `${(n / 1_000_000).toFixed(2)}` : `${Math.round(n / 1000)}`);
const reachUnit = (n: number) => (n >= 1_000_000 ? "M people" : "K people");

/* ------------------------------- word menu -------------------------------- */

function WordMenu({
  id,
  label,
  value,
  options,
  open,
  onToggle,
  onPick,
}: {
  id: ControlKey;
  label: string;
  value: string;
  options: readonly string[];
  open: boolean;
  onToggle: () => void;
  onPick: (v: string) => void;
}) {
  return (
    <span className="relative inline-block">
      <button
        type="button"
        id={`st-${id}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${label}: ${value}`}
        onClick={onToggle}
        className={cn(
          "inline-flex items-baseline gap-0.5 rounded-[12px] border-b border-[#23201d]/30 px-0.5 font-serif italic text-[#23201d] transition-colors hover:border-[#23201d]",
          focusRing,
        )}
      >
        {value}
        <ChevronDown className="size-3.5 translate-y-0.5 text-[#7a746e]" aria-hidden="true" />
      </button>
      {open && (
        <ul
          role="listbox"
          aria-labelledby={`st-${id}`}
          className="absolute left-0 top-full z-20 mt-2 min-w-48 rounded-[12px] bg-white p-1 text-sm not-italic ring-1 ring-black/5"
        >
          {options.map((o) => (
            <li key={o} role="option" aria-selected={o === value}>
              <button
                type="button"
                onClick={() => onPick(o)}
                className={cn(
                  "flex w-full items-center justify-between rounded-[8px] px-2.5 py-1.5 text-left font-sans text-[#7a746e] transition-colors hover:bg-[#fcfbf9] hover:text-[#23201d]",
                  o === value && "text-[#23201d]",
                  focusRing,
                )}
              >
                {o}
                {o === value && <span className="size-1.5 rounded-full" style={{ background: BLUSH }} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </span>
  );
}

/* ---------------------------------- page ---------------------------------- */

export default function StandardTaste() {
  const [brief, setBrief] = useState(
    "Introduce Dew, a barrier-repair serum for skin worn thin by stress, weather and over-exfoliation. Calm over hype.",
  );
  const [controls, setControls] = useState<Record<ControlKey, string>>({
    audience: "new mothers",
    channel: "Instagram",
    tone: "gentle",
    style: "soft studio",
  });
  const [openMenu, setOpenMenu] = useState<ControlKey | null>(null);
  const [concept, setConcept] = useState<ConceptId>("A");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorText, setErrorText] = useState("");
  const [shakeKey, setShakeKey] = useState(0);
  const [entries, setEntries] = useState<Entry[]>(SEED_ENTRIES);
  const [now, setNow] = useState(0);
  const [composedAt, setComposedAt] = useState<number | null>(null);
  const attempts = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const record = (text: string) => {
    const t = nowMs();
    setNow(t);
    setEntries((prev) => [{ id: t + prev.length, text, when: t }, ...prev].slice(0, 8));
  };

  const c = CONCEPTS[concept];
  const mult = CHANNEL_MULT[controls.channel];
  const toneFactor = controls.tone === "assured" ? 1.06 : controls.tone === "clinical" ? 0.96 : 1;
  const reach = Math.round(c.reach * mult.reach);
  const ctr = c.ctr * mult.ctr * toneFactor;
  const conv = c.conv * toneFactor * (controls.style === "clean lab" ? 1.04 : 1);
  const format = CONTROLS.channel.format![controls.channel];
  const briefLen = brief.trim().length;

  const pick = (key: ControlKey, v: string) => {
    setOpenMenu(null);
    if (controls[key] === v) return;
    setControls((prev) => ({ ...prev, [key]: v }));
    record(`${key[0].toUpperCase()}${key.slice(1)} set to ${v}`);
  };

  const chooseConcept = (id: ConceptId) => {
    if (id === concept) return;
    setConcept(id);
    record(`Concept ${id} · ${CONCEPTS[id].name}`);
  };

  // Error rule: an empty or sub-20-character brief fails deterministically;
  // otherwise every 4th compose attempt fails with a simulated model error.
  const generate = () => {
    if (status === "loading") return;
    attempts.current += 1;
    const attempt = attempts.current;
    setStatus("loading");
    setErrorText("");
    record(`Composing concept ${concept}`);
    timer.current = setTimeout(() => {
      if (briefLen < 20) {
        setStatus("error");
        setErrorText("The brief needs a little more — at least 20 characters before Muse can compose.");
        setShakeKey((k) => k + 1);
        record("Compose failed · brief too short");
        return;
      }
      if (attempt % 4 === 0) {
        setStatus("error");
        setErrorText("Muse lost the thread mid-composition. Nothing was changed — try once more.");
        setShakeKey((k) => k + 1);
        record("Compose failed · model interrupted");
        return;
      }
      setStatus("success");
      setComposedAt(nowMs());
      record(`Concept ${concept} composed for ${controls.channel}`);
    }, 1400);
  };

  const loading = status === "loading";
  const liveText =
    status === "loading" ? "Composing" : status === "success" ? "Composed" : status === "error" ? errorText : "";

  return (
    <div
      className="min-h-screen font-sans text-[#23201d] antialiased"
      style={{ background: PAPER }}
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpenMenu(null);
      }}
    >
      <style>{`
        @keyframes fable-st-shake { 0%,100% { transform: translateX(0) } 20% { transform: translateX(-5px) } 40% { transform: translateX(5px) } 60% { transform: translateX(-3px) } 80% { transform: translateX(3px) } }
        .fable-st-shake { animation: fable-st-shake .42s ease-in-out 1 }
        @keyframes fable-st-breathe { 0%,100% { transform: scale(1); opacity: .75 } 50% { transform: scale(1.08); opacity: 1 } }
        .fable-st-breathe { animation: fable-st-breathe 2.2s ease-in-out infinite }
        @media (prefers-reduced-motion: reduce) { .fable-st-shake, .fable-st-breathe { animation: none } }
      `}</style>

      {/* Top bar */}
      <header className="mx-auto flex max-w-6xl flex-wrap items-baseline gap-x-3 gap-y-2 px-5 pb-4 pt-7 sm:px-8">
        <h1 className="flex items-baseline gap-3 text-lg">
          <span className="font-serif italic">Muse</span>
          <span aria-hidden="true" className="text-[#7a746e]">·</span>
          <span className="text-sm text-[#7a746e]">Standard + Taste</span>
        </h1>
        <div className="ml-auto flex flex-wrap gap-2 text-[11px] tracking-wide">
          <span className="rounded-full px-2.5 py-1 text-[#7a746e] ring-1 ring-black/5">Fable 5.1</span>
          <span className="rounded-full px-2.5 py-1 text-[#7a746e] ring-1 ring-black/5">
            frontend-app-builder + taste-skill
          </span>
        </div>
      </header>

      <p aria-live="polite" className="sr-only">
        {liveText}
      </p>

      <main className="mx-auto grid max-w-6xl gap-10 px-5 pb-28 sm:px-8 min-[960px]:grid-cols-[2fr_1fr] min-[960px]:gap-14 min-[960px]:pb-16">
        {/* Left: preview, sentence, brief */}
        <section aria-label="Creative preview" className="grid content-start gap-8">
          <figure className="m-0">
            <div
              className="relative aspect-[5/4] overflow-hidden rounded-[12px] ring-1 ring-black/5"
              style={{
                background: `radial-gradient(120% 90% at 30% 20%, ${c.tint} 0%, ${PAPER} 70%)`,
              }}
            >
              {[
                { s: "42%", x: "62%", y: "14%", o: 0.55 },
                { s: "22%", x: "18%", y: "58%", o: 0.45 },
                { s: "14%", x: "78%", y: "66%", o: 0.5 },
                { s: "9%", x: "48%", y: "74%", o: 0.4 },
              ].map((d, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  className={cn("absolute aspect-square rounded-full blur-2xl", loading && "fable-st-breathe")}
                  style={{
                    width: d.s,
                    left: d.x,
                    top: d.y,
                    opacity: d.o,
                    background: `radial-gradient(circle at 35% 30%, #ffffff 0%, ${c.deep} 70%)`,
                    animationDelay: `${i * 0.3}s`,
                  }}
                />
              ))}
              <div className="relative flex h-full flex-col justify-between p-6 sm:p-10">
                <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-[#7a746e]">
                  <span>Dew</span>
                  <span>{c.name}</span>
                </div>
                <div className="max-w-[26ch]">
                  <h2
                    className="font-serif leading-[1.02] tracking-[-0.01em]"
                    style={{ fontSize: "clamp(32px, 5.2vw, 64px)" }}
                  >
                    {c.headline}
                  </h2>
                  <p className="mt-4 max-w-[38ch] text-sm leading-relaxed text-[#7a746e] sm:text-base">
                    {TONE_SUB[controls.tone]}
                  </p>
                  <span className="mt-6 inline-block rounded-full border border-[#23201d]/40 px-4 py-1.5 text-xs tracking-wide">
                    Shop Dew
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#7a746e]">
                  <span>
                    {format} · for {controls.audience}
                  </span>
                  <span className="flex items-center gap-1.5">
                    {loading && <span className="font-serif italic text-[#23201d]">Composing…</span>}
                    {status === "success" && composedAt !== null && (
                      <>
                        <Check className="size-3.5" style={{ color: SAGE }} aria-hidden="true" />
                        Composed · {relTime(composedAt, now)}
                      </>
                    )}
                    {status === "error" && <span style={{ color: ERROR }}>Not composed</span>}
                    {status === "idle" && <span>{controls.style}</span>}
                  </span>
                </div>
              </div>
            </div>
          </figure>

          {/* Sentence builder */}
          <div className="text-lg leading-[2.1] sm:text-xl">
            <p className="text-[#7a746e]">
              For{" "}
              <WordMenu
                id="audience"
                label="Audience"
                value={controls.audience}
                options={CONTROLS.audience.options}
                open={openMenu === "audience"}
                onToggle={() => setOpenMenu(openMenu === "audience" ? null : "audience")}
                onPick={(v) => pick("audience", v)}
              />
              , on{" "}
              <WordMenu
                id="channel"
                label="Channel"
                value={controls.channel}
                options={CONTROLS.channel.options}
                open={openMenu === "channel"}
                onToggle={() => setOpenMenu(openMenu === "channel" ? null : "channel")}
                onPick={(v) => pick("channel", v)}
              />
              , sounding{" "}
              <WordMenu
                id="tone"
                label="Tone"
                value={controls.tone}
                options={CONTROLS.tone.options}
                open={openMenu === "tone"}
                onToggle={() => setOpenMenu(openMenu === "tone" ? null : "tone")}
                onPick={(v) => pick("tone", v)}
              />
              , styled{" "}
              <WordMenu
                id="style"
                label="Visual style"
                value={controls.style}
                options={CONTROLS.style.options}
                open={openMenu === "style"}
                onToggle={() => setOpenMenu(openMenu === "style" ? null : "style")}
                onPick={(v) => pick("style", v)}
              />
              .
            </p>
          </div>

          {/* Brief */}
          <div>
            <div className="flex items-baseline justify-between">
              <label htmlFor="st-brief" className="text-sm">
                Brief
              </label>
              <span className="text-[11px] tabular-nums text-[#7a746e]">{briefLen} / 400</span>
            </div>
            <textarea
              id="st-brief"
              value={brief}
              maxLength={400}
              rows={3}
              onChange={(e) => setBrief(e.target.value)}
              aria-invalid={status === "error" && briefLen < 20}
              className={cn(
                "mt-2 w-full resize-none border-0 border-b border-[#23201d]/20 bg-transparent px-0 py-2 text-base leading-relaxed placeholder:text-[#7a746e]/60 focus-visible:border-[#23201d]",
                focusRing,
                "focus-visible:ring-offset-0",
              )}
              placeholder="What should Dew say, and to whom?"
            />
            {status === "error" && (
              <p role="alert" className="mt-3 text-sm" style={{ color: ERROR }}>
                {errorText}
              </p>
            )}
          </div>
        </section>

        {/* Right rail */}
        <aside className="grid content-start gap-10 min-[960px]:pt-1">
          <div>
            <h3 className="text-[11px] uppercase tracking-[0.2em] text-[#7a746e]">Concepts</h3>
            <div role="radiogroup" aria-label="Creative concept" className="mt-3 grid grid-cols-3 gap-2 min-[960px]:grid-cols-1 min-[960px]:gap-0">
              {(Object.keys(CONCEPTS) as ConceptId[]).map((id) => {
                const k = CONCEPTS[id];
                const selected = id === concept;
                return (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => chooseConcept(id)}
                    className={cn(
                      "group flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-left transition-colors",
                      selected ? "text-[#23201d]" : "text-[#7a746e] hover:text-[#23201d]",
                      focusRing,
                    )}
                    style={selected ? { background: `${k.tint}80` } : undefined}
                  >
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-current text-xs">
                      {id}
                    </span>
                    <span className="hidden min-w-0 flex-1 min-[960px]:block">
                      <span className="block font-serif text-base leading-tight">{k.name}</span>
                      <span className="block truncate text-xs text-[#7a746e]">{k.angle}</span>
                    </span>
                    <span className="font-serif text-sm min-[960px]:hidden">{k.name.split(" ")[0]}</span>
                    {selected && (
                      <span className="ml-auto hidden size-1.5 shrink-0 rounded-full min-[960px]:block" style={{ background: BLUSH }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-[11px] uppercase tracking-[0.2em] text-[#7a746e]">Forecast</h3>
            <dl className="mt-3 grid grid-cols-3 gap-3 min-[960px]:grid-cols-1 min-[960px]:gap-0">
              {[
                { label: "Reach", value: fmtReach(reach), unit: reachUnit(reach) },
                { label: "CTR", value: ctr.toFixed(2), unit: "%" },
                { label: "Conversion", value: conv.toFixed(2), unit: "%" },
              ].map((m, i) => (
                <div
                  key={m.label}
                  className={cn(
                    "flex flex-col gap-1 min-[960px]:flex-row min-[960px]:items-baseline min-[960px]:justify-between min-[960px]:py-3",
                    i > 0 && "min-[960px]:border-t min-[960px]:border-[#23201d]/10",
                  )}
                >
                  <dt className="text-xs text-[#7a746e]">{m.label}</dt>
                  <dd className="m-0 flex items-baseline gap-1">
                    <span className="font-serif text-2xl tabular-nums min-[960px]:text-3xl">{m.value}</span>
                    <span className="text-[11px] text-[#7a746e]">{m.unit}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h3 className="text-[11px] uppercase tracking-[0.2em] text-[#7a746e]">Recent</h3>
            <ul className="mt-3 grid gap-2 text-sm">
              {entries.map((e) => (
                <li key={e.id} className="flex items-baseline justify-between gap-3 text-[#7a746e] transition-colors hover:text-[#23201d]">
                  <span className="min-w-0 truncate">{e.text}</span>
                  <span className="shrink-0 text-[11px]">{relTime(e.when, now)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions: sticky bar on small screens, inline in the rail on desktop */}
          <div
            className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-[#23201d]/10 px-5 py-3 min-[960px]:static min-[960px]:grid min-[960px]:border-0 min-[960px]:p-0"
            style={{ background: PAPER }}
          >
            <button
              key={shakeKey}
              type="button"
              onClick={generate}
              disabled={loading}
              aria-busy={loading}
              className={cn(
                "flex-1 rounded-full px-5 py-3 text-sm text-[#fcfbf9] transition-opacity hover:opacity-90 disabled:opacity-60 min-[960px]:w-full",
                status === "error" && shakeKey > 0 && "fable-st-shake",
                focusRing,
              )}
              style={{ background: INK }}
            >
              {loading ? "Composing…" : status === "error" ? "Try again" : "Generate"}
            </button>
            <div className="flex items-center gap-1 min-[960px]:mt-2 min-[960px]:justify-center min-[960px]:gap-6">
              <button
                type="button"
                onClick={() => record("Draft saved")}
                className={cn("rounded-[12px] px-2 py-1.5 text-sm text-[#7a746e] transition-colors hover:text-[#23201d]", focusRing)}
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => record(`Exported concept ${concept} · ${format}`)}
                className={cn("rounded-[12px] px-2 py-1.5 text-sm text-[#7a746e] transition-colors hover:text-[#23201d]", focusRing)}
              >
                Export
              </button>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
