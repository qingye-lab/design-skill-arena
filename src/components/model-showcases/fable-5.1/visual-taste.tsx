"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------------------------------- data ---------------------------------- */

type ConceptId = "A" | "B" | "C";
type Status = "idle" | "loading" | "success" | "error";
type Metrics = { reach: number; ctr: number; conv: number };
type Note = { id: number; text: string; time: string };
type MenuId = "audience" | "channel" | "tone" | "visual";

const CLAY = "#c8643c";
const STONE = "#6b655c";
const BONE = "#fbf8f3";

const AUDIENCES = ["Home cooks", "Slow-food hosts", "Design-led kitchens", "Wedding registries"];
const CHANNELS = ["Instagram", "Pinterest", "Newsletter", "Print"];
const TONES = ["Warm", "Quiet", "Playful", "Considered"];
const VISUALS = ["Natural light", "Studio still", "Overhead table", "Hands at work"];

const CHANNEL_FORMAT: Record<string, string> = {
  Instagram: "4:5 feed",
  Pinterest: "2:3 pin",
  Newsletter: "600px header",
  Print: "A4 spread",
};

const CHANNEL_MULT: Record<string, Metrics> = {
  Instagram: { reach: 1, ctr: 1, conv: 1 },
  Pinterest: { reach: 0.8, ctr: 1.25, conv: 1.3 },
  Newsletter: { reach: 0.35, ctr: 2.1, conv: 1.8 },
  Print: { reach: 0.5, ctr: 0.6, conv: 0.9 },
};

const TONE_MULT: Record<string, number> = { Warm: 1, Quiet: 0.96, Playful: 1.08, Considered: 1.02 };

const CONCEPTS: Record<
  ConceptId,
  {
    name: string;
    plate: string;
    bowls: [string, string, string];
    headline: string;
    sub: string;
    angle: string;
    mood: string;
    palette: string;
    base: Metrics;
  }
> = {
  A: {
    name: "The Slow Kitchen",
    plate: CLAY,
    bowls: ["#efe6d8", "#8a4526", "#f6c9ae"],
    headline: "Cook slower. Taste more.",
    sub: "Terra is hand-glazed in three earth tones and fired once, so every bowl keeps the mark of the hand that made it.",
    angle: "Ritual over rush",
    mood: "Unhurried",
    palette: "Clay · Bone · Sand",
    base: { reach: 96_000, ctr: 1.9, conv: 0.9 },
  },
  B: {
    name: "Earth, Fired",
    plate: "#6f7a4a",
    bowls: ["#e7e3cf", "#3f4a2a", "#c8643c"],
    headline: "Made of earth. Made for evenings.",
    sub: "Stoneware that goes from the oven to the table without a second dish. Olive, clay and oat, glazed by hand in Portugal.",
    angle: "Material honesty",
    mood: "Grounded",
    palette: "Olive · Clay · Oat",
    base: { reach: 118_000, ctr: 2.3, conv: 1.2 },
  },
  C: {
    name: "Table Season",
    plate: "#d8c4a3",
    bowls: ["#fbf8f3", "#c8643c", "#6b655c"],
    headline: "Bring the kiln to the table.",
    sub: "Terra sets a table for six without matching a single piece. Three tones, one temperament — made to be passed around.",
    angle: "Gathering & hosting",
    mood: "Generous",
    palette: "Oat · Clay · Stone",
    base: { reach: 104_000, ctr: 2.7, conv: 1.5 },
  },
};

const TONE_CAPTION: Record<string, string> = {
  Warm: "Written warmly, like a note left on the counter",
  Quiet: "Written quietly, with room to breathe",
  Playful: "Written with a wink and a splash",
  Considered: "Written plainly, every word weighed",
};

const INITIAL_NOTES: Note[] = [
  { id: 4, text: "Concept B, Earth Fired, was composed for Instagram.", time: "10:04" },
  { id: 3, text: "Audience set to Home cooks.", time: "09:58" },
  { id: 2, text: "Brief revised, third paragraph removed.", time: "09:51" },
  { id: 1, text: "Campaign opened: Terra autumn launch.", time: "09:40" },
];

function computeMetrics(concept: ConceptId, channel: string, tone: string, seed: number): Metrics {
  const b = CONCEPTS[concept].base;
  const c = CHANNEL_MULT[channel];
  const t = TONE_MULT[tone];
  const v = 1 + ((seed % 5) - 2) * 0.015;
  return {
    reach: Math.round((b.reach * c.reach * v) / 500) * 500,
    ctr: Math.round(b.ctr * c.ctr * t * v * 10) / 10,
    conv: Math.round(b.conv * c.conv * t * v * 100) / 100,
  };
}

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/* ------------------------------- subcomponents ------------------------------ */

function InlineMenu({
  id,
  value,
  options,
  open,
  onToggle,
  onSelect,
  onClose,
}: {
  id: MenuId;
  value: string;
  options: string[];
  open: boolean;
  onToggle: () => void;
  onSelect: (v: string) => void;
  onClose: () => void;
}) {
  return (
    <span className="relative inline-block">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-menu`}
        aria-label={`${id}: ${value}`}
        onClick={onToggle}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        className="inline-flex items-baseline gap-0.5 border-b border-[#c8643c] pb-px text-[#2b2925] transition-colors hover:text-[#c8643c] focus-visible:outline focus-visible:outline-[1.5px] focus-visible:outline-offset-3 focus-visible:outline-[#c8643c]"
      >
        {value}
        <ChevronDown className="h-3.5 w-3.5 translate-y-0.5 text-[#c8643c]" aria-hidden="true" />
      </button>
      {open && (
        <ul
          id={`${id}-menu`}
          role="listbox"
          aria-label={id}
          className="absolute left-0 top-full z-20 mt-2 min-w-[200px] border border-[#6b655c]/25 bg-[#efe6d8] py-1 font-sans text-sm"
          onKeyDown={(e) => e.key === "Escape" && onClose()}
        >
          {options.map((o) => (
            <li key={o}>
              <button
                type="button"
                role="option"
                aria-selected={o === value}
                onClick={() => onSelect(o)}
                className={cn(
                  "block w-full px-4 py-2 text-left transition-colors hover:bg-[#fbf8f3] focus-visible:outline focus-visible:outline-[1.5px] focus-visible:-outline-offset-2 focus-visible:outline-[#c8643c]",
                  o === value ? "text-[#c8643c]" : "text-[#2b2925]",
                )}
              >
                {o}
              </button>
            </li>
          ))}
        </ul>
      )}
    </span>
  );
}

function Bowls({ tones }: { tones: [string, string, string] }) {
  return (
    <svg viewBox="0 0 300 380" className="h-full w-full" aria-hidden="true">
      {/* bottom bowl */}
      <path d="M40 250 C40 300 100 330 150 330 C200 330 260 300 260 250 Z" fill={tones[0]} />
      <ellipse cx="150" cy="250" rx="110" ry="22" fill={tones[0]} opacity="0.85" />
      <ellipse cx="150" cy="250" rx="92" ry="14" fill="rgba(0,0,0,0.12)" />
      {/* middle bowl */}
      <path d="M62 190 C62 232 110 258 150 258 C190 258 238 232 238 190 Z" fill={tones[1]} />
      <ellipse cx="150" cy="190" rx="88" ry="18" fill={tones[1]} />
      <ellipse cx="150" cy="190" rx="72" ry="11" fill="rgba(0,0,0,0.14)" />
      {/* top bowl */}
      <path d="M84 138 C84 172 120 194 150 194 C180 194 216 172 216 138 Z" fill={tones[2]} />
      <ellipse cx="150" cy="138" rx="66" ry="14" fill={tones[2]} />
      <ellipse cx="150" cy="138" rx="52" ry="8" fill="rgba(0,0,0,0.12)" />
      {/* highlight strokes */}
      <path d="M96 150 C100 170 118 182 138 186" stroke="rgba(255,255,255,0.35)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M72 205 C78 230 104 246 132 250" stroke="rgba(255,255,255,0.25)" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* ---------------------------------- page ---------------------------------- */

export default function VisualTaste() {
  const [brief, setBrief] = useState(
    "Introduce Terra, hand-glazed ceramic cookware in clay, olive and oat. The campaign should feel like a slow Sunday: unhurried, tactile, quietly confident. Lead with the hand-made irregularities as the point, not the flaw.",
  );
  const [audience, setAudience] = useState(AUDIENCES[0]);
  const [channel, setChannel] = useState(CHANNELS[0]);
  const [tone, setTone] = useState(TONES[0]);
  const [visual, setVisual] = useState(VISUALS[0]);
  const [openMenu, setOpenMenu] = useState<MenuId | null>(null);
  const [concept, setConcept] = useState<ConceptId>("B");
  const [status, setStatus] = useState<Status>("idle");
  const [composed, setComposed] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [seed, setSeed] = useState(1);
  const [savedAt, setSavedAt] = useState<string | null>("10:04");
  const [exported, setExported] = useState<string | null>(null);
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [notesOpen, setNotesOpen] = useState(false);

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

  const note = useCallback((text: string) => {
    setNotes((n) => [{ id: ++idRef.current, text, time: nowTime() }, ...n].slice(0, 7));
  }, []);

  /* Error rule: a brief shorter than 30 characters fails; otherwise every 4th generate fails. */
  const generate = useCallback(() => {
    if (status === "loading") return;
    generateCount.current += 1;
    setStatus("loading");
    setErrorText(null);
    setComposed(false);
    after(1500, () => {
      if (brief.trim().length < 30) {
        setStatus("error");
        setErrorText("The brief is too brief. Give the studio at least a sentence or two to work from.");
        note("Composition paused: brief too short.");
        return;
      }
      if (generateCount.current % 4 === 0) {
        setStatus("error");
        setErrorText("The studio lost the thread mid-sentence. Nothing was changed.");
        note("Composition failed on the fourth attempt.");
        return;
      }
      const next: ConceptId = concept === "A" ? "B" : concept === "B" ? "C" : "A";
      setConcept(next);
      setSeed((s) => s + 1);
      setStatus("success");
      setComposed(true);
      setSavedAt(null);
      note(`Concept ${next}, ${CONCEPTS[next].name}, was composed for ${channel}.`);
      after(2000, () => setComposed(false));
    });
  }, [status, brief, concept, channel, after, note]);

  const save = () => {
    const t = nowTime();
    setSavedAt(t);
    note("Draft saved.");
  };

  const exportNow = () => {
    setExported(`${CHANNEL_FORMAT[channel]} · PDF`);
    note(`Exported concept ${concept} as ${CHANNEL_FORMAT[channel]} PDF.`);
    after(2400, () => setExported(null));
  };

  const pick = (id: ConceptId) => {
    if (id === concept) return;
    setConcept(id);
    setSavedAt(null);
    note(`Switched to concept ${id}, ${CONCEPTS[id].name}.`);
  };

  const setControl = (menu: MenuId, value: string) => {
    if (menu === "audience") setAudience(value);
    if (menu === "channel") setChannel(value);
    if (menu === "tone") setTone(value);
    if (menu === "visual") setVisual(value);
    setOpenMenu(null);
    setSavedAt(null);
    note(`${menu[0].toUpperCase()}${menu.slice(1)} set to ${value}.`);
  };

  const current = CONCEPTS[concept];
  const metrics = computeMetrics(concept, channel, tone, seed);
  const loading = status === "loading";
  const conceptIndex = (["A", "B", "C"] as ConceptId[]).indexOf(concept);
  const fmtReach = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : String(n));

  const menuProps = (id: MenuId, value: string, options: string[]) => ({
    id,
    value,
    options,
    open: openMenu === id,
    onToggle: () => setOpenMenu((m) => (m === id ? null : id)),
    onSelect: (v: string) => setControl(id, v),
    onClose: () => setOpenMenu(null),
  });

  return (
    <div className="min-h-dvh bg-[#fbf8f3] font-sans text-[#2b2925] antialiased" style={{ backgroundColor: BONE }}>
      <style>{`
        @keyframes fable-vt-fade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        @keyframes fable-vt-draw { from { width: 0; } to { width: 100%; } }
        .fable-vt-fade { animation: fable-vt-fade 300ms ease-out both; }
        .fable-vt-draw { animation: fable-vt-draw 1.5s cubic-bezier(.4,0,.2,1) forwards; }
        @media (prefers-reduced-motion: reduce) {
          .fable-vt-fade, .fable-vt-draw { animation: none; }
          .fable-vt-draw { width: 100%; }
        }
      `}</style>

      {/* Running head */}
      <header className="relative mx-auto max-w-[1320px] px-6 lg:px-10">
        <div className="grid grid-cols-2 items-center gap-2 py-4 text-[10px] uppercase tracking-[0.22em] text-[#6b655c] sm:grid-cols-3">
          <p className="order-1">
            <span className="text-[#2b2925]">Muse</span> · Campaign Studio
          </p>
          <p className="order-2 flex flex-wrap items-center justify-end gap-x-3 gap-y-1 sm:order-3">
            <span className="text-[#2b2925]">Fable 5.1</span>
            <span className="normal-case tracking-normal">frontend-skill + taste-skill</span>
          </p>
          <h1 className="order-3 col-span-2 font-medium text-[#2b2925] sm:order-2 sm:col-span-1 sm:text-center">Visual + Taste</h1>
        </div>
        <div className="h-px w-full bg-[#6b655c]/20" />
        {loading && <div className="fable-vt-draw absolute bottom-0 left-6 h-px lg:left-10" style={{ backgroundColor: CLAY, maxWidth: "calc(100% - 3rem)" }} />}
      </header>

      <p className="sr-only" aria-live="polite">
        {loading && "Composing a new concept."}
        {status === "success" && `Concept ${concept} composed.`}
        {status === "error" && "Composition failed."}
      </p>

      <main className="mx-auto max-w-[1320px] px-6 pb-24 lg:px-10">
        {/* Hero */}
        <section aria-label="Main creative preview" className="pt-10 lg:pt-16">
          <div key={concept} className="fable-vt-fade grid gap-10 md:grid-cols-12 md:items-end lg:gap-14">
            <div className="md:order-2 md:col-span-5">
              <div
                className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl p-8 transition-colors duration-300 sm:p-12"
                style={{ backgroundColor: current.plate }}
              >
                <Bowls tones={current.bowls} />
                <span className="absolute left-6 top-6 text-[10px] uppercase tracking-[0.22em] text-white/80 mix-blend-luminosity">Terra · {CHANNEL_FORMAT[channel]}</span>
                <span className="absolute bottom-6 right-6 font-serif text-lg italic text-white/85">{visual}</span>
              </div>
              <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-[#6b655c]">
                {CHANNEL_FORMAT[channel]} · {current.palette} · {current.mood}
              </p>
            </div>
            <div className="md:order-1 md:col-span-7">
              <p className="mb-6 text-[11px] uppercase tracking-[0.22em]" style={{ color: CLAY }}>
                Concept {concept} — {current.name}
              </p>
              <h2
                className={cn(
                  "font-serif font-normal tracking-[-0.02em] transition-opacity duration-300",
                  loading ? "opacity-20" : "opacity-100",
                )}
                style={{ fontSize: "clamp(44px, 7vw, 96px)", lineHeight: 0.98 }}
              >
                {current.headline}
              </h2>
              <p className={cn("mt-8 max-w-[38ch] text-lg leading-relaxed text-[#6b655c] transition-opacity duration-300 sm:text-xl", loading && "opacity-20")}>{current.sub}</p>
              <p className="mt-6 font-serif text-base italic text-[#6b655c]">
                For {audience.toLowerCase()}, on {channel}. {TONE_CAPTION[tone]}.
              </p>
            </div>
          </div>
        </section>

        {/* Settings sentence */}
        <section aria-label="Campaign settings" className="mt-16 border-t border-[#6b655c]/20 pt-10">
          <p className="max-w-[60ch] font-serif text-2xl leading-[1.7] sm:text-[28px]">
            Speak to <InlineMenu {...menuProps("audience", audience, AUDIENCES)} /> on <InlineMenu {...menuProps("channel", channel, CHANNELS)} /> in a{" "}
            <InlineMenu {...menuProps("tone", tone, TONES)} /> voice with <InlineMenu {...menuProps("visual", visual, VISUALS)} /> visuals.
          </p>
        </section>

        {/* Brief */}
        <section aria-labelledby="brief-title" className="mt-12">
          <label id="brief-title" htmlFor="vt-brief" className="block text-[11px] uppercase tracking-[0.22em] text-[#6b655c]">
            Brief
          </label>
          <div className="mt-3 grid gap-2 border-y border-[#6b655c]/25 sm:grid-cols-[1fr_auto]">
            <textarea
              id="vt-brief"
              value={brief}
              rows={4}
              onChange={(e) => {
                setBrief(e.target.value);
                setSavedAt(null);
                if (errorText) setErrorText(null);
              }}
              aria-invalid={!!errorText}
              aria-describedby={errorText ? "vt-brief-error" : undefined}
              className="w-full resize-none bg-transparent py-6 font-serif text-xl leading-relaxed text-[#2b2925] placeholder:text-[#6b655c]/60 focus-visible:outline focus-visible:outline-[1.5px] focus-visible:outline-offset-3 focus-visible:outline-[#c8643c] sm:text-2xl"
              placeholder="Describe the launch in a paragraph…"
            />
            <p className="pb-4 text-[11px] uppercase tracking-[0.18em] text-[#6b655c] sm:self-end sm:pl-8 sm:pb-6 sm:text-right" aria-live="polite">
              {brief.length} chars
            </p>
          </div>
          {errorText && (
            <p id="vt-brief-error" role="alert" className="mt-4 font-serif text-base italic" style={{ color: "#a8442a" }}>
              {errorText}{" "}
              <button
                type="button"
                onClick={generate}
                className="underline decoration-[#a8442a]/50 underline-offset-4 hover:decoration-[#a8442a] focus-visible:outline focus-visible:outline-[1.5px] focus-visible:outline-offset-3 focus-visible:outline-[#c8643c]"
              >
                Try again
              </button>
            </p>
          )}
        </section>

        {/* Concepts + Notes */}
        <section className="mt-20 grid gap-12 md:grid-cols-12">
          <div className="md:col-span-9">
            <h2 className="text-[11px] uppercase tracking-[0.22em] text-[#6b655c]">Concepts</h2>
            <div role="radiogroup" aria-label="Concepts" className="relative mt-6 flex flex-col gap-6 md:grid md:grid-cols-3 md:gap-8 md:pb-6">
              {(["A", "B", "C"] as ConceptId[]).map((id) => {
                const c = CONCEPTS[id];
                const selected = id === concept;
                return (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => pick(id)}
                    className={cn(
                      "group flex items-center gap-5 text-left transition-opacity duration-300 md:flex-col md:items-start md:gap-5 focus-visible:outline focus-visible:outline-[1.5px] focus-visible:outline-offset-3 focus-visible:outline-[#c8643c]",
                      selected ? "opacity-100" : "opacity-70 hover:opacity-100",
                      selected && "border-l-2 pl-4 md:border-l-0 md:pl-0",
                    )}
                    style={selected ? { borderColor: CLAY } : undefined}
                  >
                    <span className="h-20 w-20 shrink-0 rounded-2xl transition-transform duration-300 group-hover:-translate-y-0.5 md:h-32 md:w-full md:rounded-3xl" style={{ backgroundColor: c.plate }} aria-hidden="true" />
                    <span className="min-w-0">
                      <span className="block text-[10px] uppercase tracking-[0.22em] text-[#6b655c]">Concept {id}</span>
                      <span className="mt-1 block font-serif text-2xl leading-tight">{c.name}</span>
                      <span className="mt-1 block text-sm text-[#6b655c]">{c.angle}</span>
                    </span>
                  </button>
                );
              })}
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 hidden h-px w-[calc((100%-4rem)/3)] transition-transform duration-300 ease-out motion-reduce:transition-none md:block"
                style={{ backgroundColor: CLAY, transform: `translateX(calc(${conceptIndex} * (100% + 2rem)))` }}
              />
            </div>

            {/* Metrics strip */}
            <dl className="mt-8 grid grid-cols-3 gap-6 border-t border-[#6b655c]/20 pt-6">
              {[
                ["Reach", fmtReach(metrics.reach)],
                ["CTR", `${metrics.ctr.toFixed(1)}%`],
                ["Conversion", `${metrics.conv.toFixed(2)}%`],
              ].map(([label, value]) => (
                <div key={label} className="flex flex-col-reverse">
                  <dt className="mt-1 text-[10px] uppercase tracking-[0.22em] text-[#6b655c]">
                    {label} · {channel}
                  </dt>
                  <dd className={cn("font-serif text-3xl tabular-nums transition-opacity duration-300 sm:text-4xl", loading && "opacity-20")}>{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Notes */}
          <aside className="md:col-span-3" aria-labelledby="notes-title">
            <h2 id="notes-title" className="hidden text-[11px] uppercase tracking-[0.22em] text-[#6b655c] md:block">
              Notes ({notes.length})
            </h2>
            <button
              type="button"
              onClick={() => setNotesOpen((o) => !o)}
              aria-expanded={notesOpen}
              aria-controls="vt-notes"
              className="flex w-full items-center justify-between text-[11px] uppercase tracking-[0.22em] text-[#6b655c] focus-visible:outline focus-visible:outline-[1.5px] focus-visible:outline-offset-3 focus-visible:outline-[#c8643c] md:hidden"
            >
              Notes ({notes.length})
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", notesOpen && "rotate-180")} aria-hidden="true" />
            </button>
            <ol id="vt-notes" className={cn("mt-6 space-y-5 border-l border-[#6b655c]/20 pl-5 md:block", notesOpen ? "block" : "hidden")}>
              {notes.map((n) => (
                <li key={n.id} className="font-serif text-[15px] italic leading-snug text-[#2b2925]">
                  {n.text}
                  <time className="mt-1 block font-sans text-[10px] not-italic uppercase tracking-[0.18em] text-[#6b655c]">{n.time}</time>
                </li>
              ))}
            </ol>
          </aside>
        </section>

        {/* Actions */}
        <section aria-label="Actions" className="mt-20 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-[#6b655c]/20 pt-8">
          <button
            type="button"
            onClick={generate}
            disabled={loading}
            className="inline-flex h-12 items-center rounded-full px-7 text-sm font-medium tracking-wide text-[#fbf8f3] transition-opacity hover:opacity-90 disabled:opacity-60 focus-visible:outline focus-visible:outline-[1.5px] focus-visible:outline-offset-3 focus-visible:outline-[#c8643c]"
            style={{ backgroundColor: CLAY }}
          >
            {loading ? "Composing…" : "Generate"}
          </button>
          <button
            type="button"
            onClick={save}
            disabled={!!savedAt}
            className="text-sm underline decoration-[#6b655c]/40 underline-offset-[6px] transition-colors hover:decoration-[#c8643c] disabled:text-[#6b655c] disabled:no-underline focus-visible:outline focus-visible:outline-[1.5px] focus-visible:outline-offset-3 focus-visible:outline-[#c8643c]"
          >
            {savedAt ? `Saved ${savedAt}` : "Save"}
          </button>
          <button
            type="button"
            onClick={exportNow}
            className="text-sm underline decoration-[#6b655c]/40 underline-offset-[6px] transition-colors hover:decoration-[#c8643c] focus-visible:outline focus-visible:outline-[1.5px] focus-visible:outline-offset-3 focus-visible:outline-[#c8643c]"
          >
            {exported ? `Exported · ${exported}` : "Export"}
          </button>
          {composed && (
            <span className="fable-vt-fade font-serif text-base italic" style={{ color: STONE }}>
              Composed.
            </span>
          )}
          <span className="ml-auto hidden text-[10px] uppercase tracking-[0.22em] text-[#6b655c] sm:block">
            Terra · Autumn launch · {CHANNEL_FORMAT[channel]}
          </span>
        </section>
      </main>
    </div>
  );
}
