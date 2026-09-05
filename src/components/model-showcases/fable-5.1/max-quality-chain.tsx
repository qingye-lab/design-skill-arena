"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type Ref } from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Columns3,
  Command,
  Download,
  FileImage,
  FileText,
  Loader2,
  Mail,
  Mic,
  Minus,
  Monitor,
  MousePointerClick,
  Palette,
  Save,
  Search,
  Share2,
  SlidersHorizontal,
  Sparkles,
  Target,
  X,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Types + mock data                                                   */
/* ------------------------------------------------------------------ */

type ConceptId = "A" | "B" | "C";
type Ratio = "feed" | "story" | "banner";
type Channel = "social" | "email" | "display" | "search";
type Tone = "plain" | "confident" | "warm";
type Style = "night" | "daylight" | "blueprint" | "bold";

type Concept = {
  id: ConceptId;
  name: string;
  angle: string;
  accent: string;
  dark: string;
  light: string;
  curve: number[];
  headlines: [string, string];
  base: { reach: number; ctr: number; conv: number };
};

const CONCEPTS: Concept[] = [
  { id: "A", name: "Off-Peak", angle: "Charge when power is cheapest", accent: "#2f6bff", dark: "#0b1220", light: "#e9effc", curve: [62, 70, 78, 84, 52, 28, 18, 14, 22, 40, 66, 74], headlines: ["Your car knows when power is cheap.", "Plug in at six. Pay for three a.m."], base: { reach: 61200, ctr: 1.8, conv: 2.1 } },
  { id: "B", name: "Grid Friendly", angle: "Good for the bill, good for the grid", accent: "#12b886", dark: "#08302a", light: "#e6f7f1", curve: [48, 56, 66, 80, 72, 44, 26, 20, 24, 36, 52, 60], headlines: ["Charge with the wind, not against it.", "The greenest kilowatt is the cheapest one."], base: { reach: 47800, ctr: 2.3, conv: 2.6 } },
  { id: "C", name: "Overnight", angle: "Wake up full, every morning", accent: "#f5b544", dark: "#1b1633", light: "#fdf3e1", curve: [70, 74, 80, 88, 60, 34, 22, 16, 18, 30, 58, 68], headlines: ["Full by sunrise. Cheaper by design.", "Sleep. Flux handles the rest."], base: { reach: 53400, ctr: 2.0, conv: 1.9 } },
];

const AUDIENCES = [
  { id: "solar", label: "EV owners with rooftop solar", line: "solar households that already watch their export tariff" },
  { id: "new", label: "First-time EV buyers", line: "first-time EV owners who want charging to feel boring" },
  { id: "twocar", label: "Two-car households", line: "households juggling one driveway and two batteries" },
  { id: "fleet", label: "Small fleet operators", line: "small fleets whose vans must be full by 7am" },
  { id: "landlord", label: "Landlords and HOAs", line: "landlords adding charging to shared parking" },
  { id: "apartment", label: "Apartment dwellers", line: "apartment residents charging on a shared meter" },
];

const CHANNELS: { id: Channel; label: string; icon: typeof Mail; reach: number; ctr: number; conv: number }[] = [
  { id: "social", label: "Social", icon: Share2, reach: 1, ctr: 1, conv: 1 },
  { id: "email", label: "Email", icon: Mail, reach: 0.3, ctr: 2.4, conv: 1.8 },
  { id: "display", label: "Display", icon: Monitor, reach: 2.1, ctr: 0.35, conv: 0.6 },
  { id: "search", label: "Search", icon: Search, reach: 0.55, ctr: 1.9, conv: 2.2 },
];

const TONES: { id: Tone; label: string; example: string; sub: string; cta: string }[] = [
  { id: "plain", label: "Plain", example: "“Charges overnight for less.”", sub: "Flux schedules charging around live grid prices. Plug in, set a departure time, and it finds the cheapest hours.", cta: "See pricing" },
  { id: "confident", label: "Confident", example: "“The smartest outlet in your house.”", sub: "Flux reads the grid every five minutes and charges only when the price drops. Same battery, smaller bill.", cta: "Get Flux" },
  { id: "warm", label: "Warm", example: "“Full battery, smaller bill.”", sub: "Set when you need the car and go to bed. Flux quietly finds the cheapest hours and has you ready by morning.", cta: "Start saving" },
];

const STYLES: { id: Style; label: string; swatch: string }[] = [
  { id: "night", label: "Night", swatch: "linear-gradient(135deg,#0b1220,#2a3550)" },
  { id: "daylight", label: "Daylight", swatch: "linear-gradient(135deg,#ffffff,#dfe7f7)" },
  { id: "blueprint", label: "Blueprint", swatch: "repeating-linear-gradient(0deg,#0f2a5f 0 2px,#143a80 2px 6px)" },
  { id: "bold", label: "Bold", swatch: "linear-gradient(135deg,#2f6bff,#f5b544)" },
];

const RATIOS: { id: Ratio; label: string; aspect: string; max: string }[] = [
  { id: "feed", label: "Feed 4:5", aspect: "4 / 5", max: "440px" },
  { id: "story", label: "Story 9:16", aspect: "9 / 16", max: "330px" },
  { id: "banner", label: "Banner 3:1", aspect: "3 / 1", max: "100%" },
];

const BRIEF_MIN = 20;
const BRIEF_MAX = 360;
const BLUE = "#2f6bff";
const AMBER = "#f5b544";

type ActivityKind = "generate" | "save" | "export" | "select" | "control";
type Activity = { id: number; kind: ActivityKind; text: string; at: number };
type Toast = { id: number; kind: "default" | "success" | "destructive"; title: string; action?: { label: string; run: () => void } };
type CommandItem = { id: string; label: string; hint?: string; run: () => void };

const SECTIONS: { icon: typeof FileText; label: string }[] = [
  { icon: FileText, label: "Brief" },
  { icon: Target, label: "Targeting" },
  { icon: Mic, label: "Voice" },
  { icon: Palette, label: "Look" },
];

const ACTIVITY_ICON: Record<ActivityKind, typeof Sparkles> = { generate: Sparkles, save: Save, export: Download, select: MousePointerClick, control: SlidersHorizontal };

const ring = "outline-none focus-visible:ring-2 focus-visible:ring-[#2f6bff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f7fb]";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/** Wall-clock read, only ever invoked from event handlers. */
function stamp() {
  return Date.now();
}

function hhmm(at: number) {
  return new Date(at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function fuzzy(query: string, text: string) {
  const q = query.toLowerCase().replace(/\s+/g, "");
  if (!q) return true;
  let i = 0;
  for (const ch of text.toLowerCase()) if (ch === q[i]) i += 1;
  return i === q.length;
}

function miniBars(seed: number, metric: number) {
  const shape = [0.3, 0.42, 0.38, 0.5, 0.62, 0.58, 0.7, 0.66, 0.82, 0.9];
  return shape.map((v, i) => Math.min(1, Math.max(0.12, v + ((((seed + 2) * (i + 3) * (metric + 5)) % 19) - 9) / 100)));
}

function isTyping(el: EventTarget | null) {
  const node = el as HTMLElement | null;
  return !!node && (!!node.closest("input, textarea, select, [contenteditable=true]") || node.isContentEditable);
}

/* ------------------------------------------------------------------ */
/* Sub-components (module level)                                       */
/* ------------------------------------------------------------------ */

function KeyVisual({ concept, style, tone, audience, channel, ratio, variant, loading, compact }: { concept: Concept; style: Style; tone: Tone; audience: string; channel: string; ratio: Ratio; variant: 0 | 1; loading: boolean; compact?: boolean }) {
  const r = RATIOS.find((x) => x.id === ratio)!;
  const t = TONES.find((x) => x.id === tone)!;
  const dark = style === "night" || style === "blueprint" || style === "bold";
  const bg =
    style === "night" ? `radial-gradient(120% 90% at 80% 0%, ${concept.accent}55, transparent 60%), ${concept.dark}`
    : style === "daylight" ? `linear-gradient(180deg, #ffffff, ${concept.light})`
    : style === "blueprint" ? `repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 16px), repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 16px), #0f2a5f`
    : `linear-gradient(150deg, ${concept.accent}, ${concept.dark})`;
  const ink = dark ? "#ffffff" : "#0b1220";
  const stroke = style === "bold" ? "#ffffff" : concept.accent;
  const w = 240;
  const h = 80;
  const pts = concept.curve.map((v, i) => `${(i / (concept.curve.length - 1)) * w},${h - (v / 100) * (h - 8) - 4}`).join(" ");
  const cheap = concept.curve.map((v, i) => (v < 30 ? i : -1)).filter((i) => i >= 0);
  const x0 = (cheap[0] / (concept.curve.length - 1)) * w;
  const x1 = (cheap[cheap.length - 1] / (concept.curve.length - 1)) * w;
  const banner = ratio === "banner";

  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-[#e3e8f0] shadow-sm" style={{ aspectRatio: r.aspect, background: bg, color: ink }} role="img" aria-label={`${concept.name} key visual, ${r.label}`}>
      <div className={`absolute inset-0 flex ${banner ? "flex-row items-center gap-6 px-6" : compact ? "flex-col p-3" : "flex-col p-5"}`}>
        <div className={`flex items-center justify-between ${banner ? "order-3 ml-auto flex-col items-end gap-2" : ""}`}>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider opacity-90">
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden><rect x="3" y="4" width="18" height="16" rx="5" fill={stroke} opacity="0.25" /><path d="M13 5 8 13h4l-1 6 5-8h-4l1-6Z" fill={stroke} /></svg>
            Flux
          </span>
          <span className="rounded-full border px-2 py-0.5 text-[10px] opacity-80" style={{ borderColor: `${ink}44` }}>{r.label} · {channel}</span>
        </div>
        {loading ? (
          <div className={`flex flex-1 flex-col justify-end gap-2 ${banner ? "order-1 justify-center" : ""}`} aria-busy="true">
            <div className="h-6 w-3/4 animate-pulse rounded" style={{ background: `${ink}22` }} />
            <div className="h-6 w-1/2 animate-pulse rounded" style={{ background: `${ink}22` }} />
            <div className="h-3 w-full animate-pulse rounded" style={{ background: `${ink}18` }} />
            <div className="h-3 w-2/3 animate-pulse rounded" style={{ background: `${ink}18` }} />
          </div>
        ) : (
          <div className={`flex flex-1 flex-col justify-end gap-2 ${banner ? "order-1 max-w-[46%] justify-center" : ""}`}>
            <h3 className={`font-semibold leading-[1.05] tracking-tight ${compact ? "text-base" : banner ? "text-[clamp(1rem,2.4vw,1.75rem)]" : "text-[clamp(1.25rem,3vw,2rem)]"}`}>{concept.headlines[variant]}</h3>
            {!compact && <p className={`opacity-85 ${banner ? "text-[11px] leading-snug" : "text-xs leading-relaxed"}`}>{t.sub} For {audience}.</p>}
            <div className="mt-1 flex items-center gap-3">
              <span className="rounded-md px-2.5 py-1 text-[11px] font-medium" style={{ background: style === "bold" ? "#ffffff" : concept.accent, color: style === "bold" ? concept.dark : concept.id === "C" ? "#1b1633" : "#ffffff" }}>{t.cta}</span>
              <span className="text-[10px] opacity-70">{concept.angle}</span>
            </div>
          </div>
        )}
        <svg viewBox={`0 0 ${w} ${h}`} className={`w-full ${banner ? "order-2 max-w-[38%]" : compact ? "mt-2 max-h-14" : "mt-3 max-h-20"}`} preserveAspectRatio="none" aria-hidden>
          <rect x={x0} y="0" width={Math.max(6, x1 - x0)} height={h} fill={AMBER} opacity={style === "bold" ? 0.35 : 0.22} rx="3" />
          <polyline points={pts} fill="none" stroke={stroke} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          <text x={x0 + 4} y="12" fontSize="8" fill={ink} opacity="0.85" fontWeight="600">cheapest window</text>
        </svg>
      </div>
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: number) => void }) {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = window.setTimeout(() => onDismiss(toast.id), 4500);
    return () => window.clearTimeout(t);
  }, [paused, onDismiss, toast.id]);
  const tone = toast.kind === "destructive" ? "border-[#f3b8b8] bg-[#fff5f5] text-[#8f1d1d]" : toast.kind === "success" ? "border-[#bfe3cf] bg-[#f2fbf6] text-[#155a36]" : "border-[#e3e8f0] bg-white text-[#0b1220]";
  return (
    <div role="status" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)} className={`pointer-events-auto flex w-[300px] items-center gap-2 rounded-lg border px-3 py-2.5 text-[13px] shadow-lg ${tone}`}>
      {toast.kind === "destructive" ? <AlertTriangle className="size-4 shrink-0" aria-hidden /> : <Check className="size-4 shrink-0" aria-hidden />}
      <span className="flex-1">{toast.title}</span>
      {toast.action && (
        <button type="button" onClick={() => { toast.action?.run(); onDismiss(toast.id); }} className={`rounded-md px-2 py-1 text-xs font-semibold underline-offset-2 hover:underline ${ring}`}>{toast.action.label}</button>
      )}
      <button type="button" onClick={() => onDismiss(toast.id)} aria-label="Dismiss" className={`rounded-md p-1 opacity-70 hover:opacity-100 ${ring}`}><X className="size-3.5" aria-hidden /></button>
    </div>
  );
}

function CommandPalette({ open, commands, onClose }: { open: boolean; commands: CommandItem[]; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const results = commands.filter((c) => fuzzy(query, c.label));
  const active = Math.min(index, Math.max(0, results.length - 1));
  if (!open) return null;
  const run = (c: CommandItem) => {
    c.run();
    setQuery("");
    setIndex(0);
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-[#0b1220]/30 px-4 pt-[12vh]" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-label="Command palette" className="w-full max-w-lg overflow-hidden rounded-lg border border-[#e3e8f0] bg-white shadow-2xl">
        <div className="flex items-center gap-2 border-b border-[#e3e8f0] px-3">
          <Search className="size-4 text-[#64708a]" aria-hidden />
          <input
            autoFocus
            role="combobox"
            aria-expanded="true"
            aria-controls="mq-cmd-list"
            aria-activedescendant={results[active] ? `mq-cmd-${results[active].id}` : undefined}
            aria-label="Search actions"
            placeholder="Type a command…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setIndex(0); }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setIndex((i) => Math.min(i + 1, results.length - 1)); }
              else if (e.key === "ArrowUp") { e.preventDefault(); setIndex((i) => Math.max(i - 1, 0)); }
              else if (e.key === "Enter" && results[active]) { e.preventDefault(); run(results[active]); }
              else if (e.key === "Escape") { e.preventDefault(); onClose(); }
            }}
            className="h-11 flex-1 bg-transparent text-sm outline-none placeholder:text-[#94a0b8]"
          />
          <kbd className="rounded border border-[#e3e8f0] px-1.5 py-0.5 font-mono text-[10px] text-[#64708a]">Esc</kbd>
        </div>
        <ul id="mq-cmd-list" role="listbox" className="max-h-72 overflow-y-auto p-1">
          {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-[#64708a]">No matching actions.</li>}
          {results.map((c, i) => (
            <li key={c.id} id={`mq-cmd-${c.id}`} role="option" aria-selected={i === active}>
              <button type="button" tabIndex={-1} onMouseEnter={() => setIndex(i)} onClick={() => run(c)} className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm ${i === active ? "bg-[#eef3ff] text-[#0b1220]" : "text-[#1f2a44] hover:bg-[#f5f7fb]"}`}>
                <span>{c.label}</span>
                {c.hint && <kbd className="font-mono text-[10px] text-[#64708a]">{c.hint}</kbd>}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

type SetupProps = {
  idp: string;
  brief: string; onBrief: (v: string) => void; briefError: string | null; onBriefBlur: () => void;
  audience: string; onAudience: (id: string) => void;
  channel: Channel; onChannel: (c: Channel) => void;
  tone: Tone; onTone: (t: Tone) => void;
  style: Style; onStyle: (s: Style) => void;
  firstFieldRef?: Ref<HTMLTextAreaElement>;
};

function SetupPanel({ idp, brief, onBrief, briefError, onBriefBlur, audience, onAudience, channel, onChannel, tone, onTone, style, onStyle, firstFieldRef }: SetupProps) {
  const [q, setQ] = useState("");
  const list = AUDIENCES.filter((a) => a.label.toLowerCase().includes(q.trim().toLowerCase()));
  const section = "border-b border-[#e3e8f0] px-4 py-4";
  const label = "text-[12px] font-semibold uppercase tracking-wider text-[#64708a]";
  return (
    <div className="flex flex-col text-[13px]">
      <section className={section}>
        <div className="flex items-baseline justify-between">
          <label htmlFor={`${idp}-brief`} className={label}>Brief</label>
          <span className="text-[11px] tabular-nums text-[#64708a]">{brief.length}/{BRIEF_MAX}</span>
        </div>
        <textarea
          id={`${idp}-brief`}
          ref={firstFieldRef}
          value={brief}
          rows={5}
          maxLength={BRIEF_MAX}
          aria-invalid={briefError !== null}
          aria-describedby={`${idp}-brief-msg`}
          onChange={(e) => onBrief(e.target.value)}
          onBlur={onBriefBlur}
          className={`mt-2 w-full resize-none rounded-lg border bg-white px-3 py-2 text-[13px] leading-relaxed ${ring} ${briefError ? "border-[#e11d48] ring-2 ring-[#e11d48]/30" : "border-[#e3e8f0]"}`}
        />
        <p id={`${idp}-brief-msg`} className={`mt-1.5 min-h-4 text-[11px] ${briefError ? "text-[#b91c1c]" : "text-[#64708a]"}`}>{briefError ?? `Minimum ${BRIEF_MIN} characters. ⌘/Ctrl+Enter to generate.`}</p>
      </section>

      <section className={section}>
        <span className={label} id={`${idp}-aud-label`}>Targeting</span>
        <label htmlFor={`${idp}-aud-search`} className="sr-only">Filter audiences</label>
        <div className="relative mt-2">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#64708a]" aria-hidden />
          <input id={`${idp}-aud-search`} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter audiences" className={`h-8 w-full rounded-lg border border-[#e3e8f0] bg-white pl-8 pr-2 text-[13px] ${ring}`} />
        </div>
        <div role="radiogroup" aria-labelledby={`${idp}-aud-label`} className="mt-2 flex max-h-40 flex-col gap-0.5 overflow-y-auto">
          {list.length === 0 && <p className="px-2 py-2 text-[12px] text-[#64708a]">No audiences match “{q}”.</p>}
          {list.map((a) => {
            const on = a.id === audience;
            return (
              <button key={a.id} type="button" role="radio" aria-checked={on} onClick={() => onAudience(a.id)} className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-[#eef3ff] ${ring} ${on ? "bg-[#eef3ff] font-medium" : ""}`}>
                <span className={`flex size-3.5 items-center justify-center rounded-full border ${on ? "border-[#2f6bff]" : "border-[#c4ccdb]"}`} aria-hidden>{on && <span className="size-2 rounded-full bg-[#2f6bff]" />}</span>
                <span className="flex-1 truncate">{a.label}</span>
              </button>
            );
          })}
        </div>
        <div role="radiogroup" aria-label="Channel" className="mt-3 grid grid-cols-4 gap-1 rounded-lg border border-[#e3e8f0] bg-white p-1">
          {CHANNELS.map((c) => {
            const Icon = c.icon;
            const on = c.id === channel;
            return (
              <button key={c.id} type="button" role="radio" aria-checked={on} aria-label={c.label} title={c.label} onClick={() => onChannel(c.id)} className={`flex h-8 flex-col items-center justify-center rounded-md transition-colors ${ring} ${on ? "bg-[#0b1220] text-white" : "text-[#64708a] hover:bg-[#f5f7fb]"}`}>
                <Icon className="size-4" aria-hidden />
              </button>
            );
          })}
        </div>
      </section>

      <section className={section}>
        <span className={label} id={`${idp}-tone-label`}>Voice</span>
        <div role="radiogroup" aria-labelledby={`${idp}-tone-label`} className="mt-2 flex flex-col gap-1">
          {TONES.map((t) => {
            const on = t.id === tone;
            return (
              <button key={t.id} type="button" role="radio" aria-checked={on} onClick={() => onTone(t.id)} className={`flex items-start gap-2 rounded-md border px-2.5 py-2 text-left transition-colors hover:bg-[#eef3ff] ${ring} ${on ? "border-[#2f6bff] bg-[#eef3ff]" : "border-transparent"}`}>
                <span className={`mt-0.5 flex size-3.5 shrink-0 items-center justify-center rounded-full border ${on ? "border-[#2f6bff]" : "border-[#c4ccdb]"}`} aria-hidden>{on && <span className="size-2 rounded-full bg-[#2f6bff]" />}</span>
                <span className="flex flex-col"><span className="font-medium">{t.label}</span><span className="text-[12px] text-[#64708a]">{t.example}</span></span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="px-4 py-4">
        <span className={label} id={`${idp}-style-label`}>Look</span>
        <div role="radiogroup" aria-labelledby={`${idp}-style-label`} className="mt-2 grid grid-cols-4 gap-2">
          {STYLES.map((s) => {
            const on = s.id === style;
            return (
              <button key={s.id} type="button" role="radio" aria-checked={on} aria-label={s.label} onClick={() => onStyle(s.id)} className={`group flex flex-col items-center gap-1 rounded-lg p-1 ${ring}`}>
                <span className={`relative h-10 w-full rounded-md border ${on ? "border-[#2f6bff] ring-2 ring-[#2f6bff]/30" : "border-[#e3e8f0]"}`} style={{ background: s.swatch }} aria-hidden>
                  {on && <Check className="absolute right-1 top-1 size-3.5 rounded-full bg-[#f5b544] p-0.5 text-[#0b1220]" />}
                </span>
                <span className="text-[11px] text-[#64708a] group-aria-checked:font-medium group-aria-checked:text-[#0b1220]">{s.label}</span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function MaxQualityChain() {
  const [name, setName] = useState("Flux launch");
  const [editingName, setEditingName] = useState(false);
  const [draftName, setDraftName] = useState(name);
  const [brief, setBrief] = useState("Launch Flux, a home EV charger that schedules charging around live grid prices. Lead with the bill, not the hardware.");
  const [audience, setAudience] = useState("solar");
  const [channel, setChannel] = useState<Channel>("social");
  const [tone, setTone] = useState<Tone>("plain");
  const [style, setStyle] = useState<Style>("night");
  const [concept, setConcept] = useState<ConceptId>("B");
  const [variant, setVariant] = useState<0 | 1>(0);
  const [ratio, setRatio] = useState<Ratio>("feed");
  const [compare, setCompare] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [palette, setPalette] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("Ready");
  const [saved, setSaved] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [activity, setActivity] = useState<Activity[]>(() => {
    const t = Date.now();
    return [
      { id: 2, kind: "select", text: "Concept B · Grid Friendly selected", at: t - 6 * 60_000 },
      { id: 1, kind: "control", text: "Campaign created", at: t - 31 * 60_000 },
    ];
  });

  const timers = useRef<Set<number>>(new Set());
  const nextId = useRef(3);
  const generateCount = useRef(0);
  const paletteTrigger = useRef<HTMLElement | null>(null);
  const exportRef = useRef<HTMLDivElement | null>(null);
  const drawerFirst = useRef<HTMLTextAreaElement | null>(null);
  const actions = useRef<Record<string, () => void>>({});

  useEffect(() => {
    const set = timers.current;
    return () => {
      set.forEach((t) => window.clearTimeout(t));
      set.clear();
    };
  }, []);

  useEffect(() => {
    if (drawer) drawerFirst.current?.focus();
  }, [drawer]);

  useEffect(() => {
    if (!exportOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!exportRef.current?.contains(e.target as Node)) setExportOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [exportOpen]);

  const schedule = (fn: () => void, ms: number) => {
    const id = window.setTimeout(() => { timers.current.delete(id); fn(); }, ms);
    timers.current.add(id);
  };

  const dismissToast = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const pushToast = (t: Omit<Toast, "id">) => setToasts((all) => [...all, { ...t, id: nextId.current++ }].slice(-3));
  const log = (kind: ActivityKind, text: string) => setActivity((a) => [{ id: nextId.current++, kind, text, at: stamp() }, ...a].slice(0, 8));

  const current = CONCEPTS.find((c) => c.id === concept)!;
  const aud = AUDIENCES.find((a) => a.id === audience)!;
  const ch = CHANNELS.find((c) => c.id === channel)!;
  const briefValid = brief.trim().length >= BRIEF_MIN;
  const briefError = error ?? (briefValid ? null : `Brief needs at least ${BRIEF_MIN} characters.`);

  const forecast = useMemo(() => {
    const toneMod = { plain: [1, 1, 1.03], confident: [1.02, 1.09, 1], warm: [1.04, 1.02, 1.05] }[tone];
    const seed = CONCEPTS.indexOf(current) * 4 + CHANNELS.indexOf(ch);
    const rows = [
      { key: "reach", label: "Reach", baseline: current.base.reach, value: current.base.reach * ch.reach * toneMod[0], fmt: (v: number) => `${(v / 1000).toFixed(1)}K` },
      { key: "ctr", label: "CTR", baseline: current.base.ctr, value: current.base.ctr * ch.ctr * toneMod[1], fmt: (v: number) => `${v.toFixed(2)}%` },
      { key: "conv", label: "Conversion", baseline: current.base.conv, value: current.base.conv * ch.conv * toneMod[2], fmt: (v: number) => `${v.toFixed(2)}%` },
    ];
    return rows.map((r, i) => ({ ...r, display: r.fmt(r.value), delta: Math.round(((r.value - r.baseline) / r.baseline) * 100), bars: miniBars(seed, i) }));
  }, [current, ch, tone]);

  /* ---- actions ---------------------------------------------------- */

  // Error rule: a brief under 20 characters fails immediately (inline + toast);
  // otherwise every 4th generate attempt fails after the loading window.
  const generate = () => {
    if (loading) return;
    if (!briefValid) {
      setError(`Brief needs at least ${BRIEF_MIN} characters before generating.`);
      setStatus("Generation blocked · brief too short");
      pushToast({ kind: "destructive", title: "Brief is too short to generate.", action: { label: "Fix", run: () => setDrawer(true) } });
      return;
    }
    setError(null);
    setLoading(true);
    generateCount.current += 1;
    const fail = generateCount.current % 4 === 0;
    setStatus(`Generating concept ${concept}…`);
    log("generate", `Generating concept ${concept}`);
    const started = stamp();
    schedule(() => {
      setLoading(false);
      const secs = ((stamp() - started) / 1000).toFixed(1);
      if (fail) {
        setError("The model returned an empty concept. Try again.");
        setStatus(`Generation failed · concept ${concept}`);
        pushToast({ kind: "destructive", title: `Concept ${concept} failed to generate.`, action: { label: "Retry", run: () => actions.current.generate?.() } });
        log("generate", `Concept ${concept} failed`);
        return;
      }
      setVariant((v) => (v === 0 ? 1 : 0));
      setStatus(`Concept ${concept} regenerated · ${secs}s`);
      pushToast({ kind: "success", title: `Concept ${concept} regenerated · ${secs}s` });
      log("generate", `Concept ${concept} regenerated`);
    }, 1400);
  };

  const save = () => {
    setSaved(true);
    setStatus(`Draft saved · ${hhmm(stamp())}`);
    pushToast({ kind: "default", title: "Draft saved" });
    log("save", "Draft saved");
    schedule(() => setSaved(false), 2000);
  };

  const exportAs = (kind: "PNG" | "PDF") => {
    setExportOpen(false);
    setStatus(`Exported ${kind} · ${RATIOS.find((r) => r.id === ratio)!.label}`);
    pushToast({ kind: "default", title: `${kind} exported · ${current.name}` });
    log("export", `Exported ${kind}`);
  };

  const select = (id: ConceptId) => {
    if (id === concept) return;
    setConcept(id);
    setStatus(`Concept ${id} selected`);
    log("select", `Concept ${id} · ${CONCEPTS.find((c) => c.id === id)!.name} selected`);
  };

  const control = <T,>(setter: (v: T) => void, v: T, text: string) => {
    setter(v);
    log("control", text);
  };

  const openPalette = (from?: HTMLElement | null) => {
    paletteTrigger.current = from ?? (document.activeElement as HTMLElement | null);
    setPalette(true);
  };
  const closePalette = () => {
    setPalette(false);
    const el = paletteTrigger.current;
    schedule(() => el?.focus(), 0);
  };

  const commitName = () => {
    const v = draftName.trim();
    if (v && v !== name) {
      setName(v);
      log("control", `Renamed campaign to “${v}”`);
    }
    setEditingName(false);
  };

  const commands: CommandItem[] = [
    { id: "generate", label: "Generate concept", hint: "G", run: generate },
    { id: "save", label: "Save draft", hint: "S", run: save },
    { id: "png", label: "Export PNG", run: () => exportAs("PNG") },
    { id: "pdf", label: "Export PDF", run: () => exportAs("PDF") },
    ...CONCEPTS.map((c) => ({ id: `c${c.id}`, label: `Select concept ${c.id} · ${c.name}`, hint: c.id === "A" ? "1" : c.id === "B" ? "2" : "3", run: () => select(c.id) })),
    ...RATIOS.map((r) => ({ id: r.id, label: `Set ratio ${r.label}`, run: () => control(setRatio, r.id, `Ratio → ${r.label}`) })),
    { id: "compare", label: compare ? "Turn compare off" : "Turn compare on", run: () => control(setCompare, !compare, `Compare ${compare ? "off" : "on"}`) },
    { id: "clear", label: "Clear activity", run: () => setActivity([]) },
  ];

  useEffect(() => {
    actions.current = { generate, save, export: () => setExportOpen((o) => !o), a: () => select("A"), b: () => select("B"), c: () => select("C"), palette: () => openPalette(), escape: () => { setPalette(false); setExportOpen(false); setDrawer(false); setEditingName(false); } };
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const a = actions.current;
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "k") { e.preventDefault(); a.palette?.(); return; }
      if (mod && e.key === "Enter") { e.preventDefault(); a.generate?.(); return; }
      if (e.key === "Escape") { a.escape?.(); return; }
      if (mod || e.altKey || isTyping(e.target)) return;
      const map: Record<string, string> = { g: "generate", s: "save", e: "export", "1": "a", "2": "b", "3": "c" };
      const key = map[e.key.toLowerCase()];
      if (key) { e.preventDefault(); a[key]?.(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ---- render ----------------------------------------------------- */

  const setupProps: Omit<SetupProps, "idp" | "firstFieldRef"> = {
    brief, onBrief: (v) => { setBrief(v); if (error) setError(null); }, briefError, onBriefBlur: () => log("control", "Brief edited"),
    audience, onAudience: (id) => control(setAudience, id, `Audience → ${AUDIENCES.find((a) => a.id === id)!.label}`),
    channel, onChannel: (c) => control(setChannel, c, `Channel → ${CHANNELS.find((x) => x.id === c)!.label}`),
    tone, onTone: (t) => control(setTone, t, `Voice → ${TONES.find((x) => x.id === t)!.label}`),
    style, onStyle: (s) => control(setStyle, s, `Look → ${STYLES.find((x) => x.id === s)!.label}`),
  };

  const visual = (c: Concept, compact?: boolean) => (
    <KeyVisual concept={c} style={style} tone={tone} audience={aud.line} channel={ch.label} ratio={ratio} variant={c.id === concept ? variant : 0} loading={loading && c.id === concept} compact={compact} />
  );

  const generateBtn = (full?: boolean) => (
    <button type="button" onClick={generate} disabled={loading} aria-busy={loading} className={`relative inline-flex h-9 items-center justify-center gap-2 overflow-hidden rounded-lg bg-[#2f6bff] px-3.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#2559d9] disabled:cursor-progress ${ring} ${full ? "w-full" : ""}`}>
      {loading && <span className="fable-mq-sweep absolute inset-0 bg-white/20" aria-hidden />}
      {loading ? <Loader2 className="relative size-4 animate-spin motion-reduce:animate-none" aria-hidden /> : <Sparkles className="relative size-4" aria-hidden />}
      <span className="relative">{loading ? "Generating…" : "Generate"}</span>
      {!loading && <kbd className="relative hidden rounded border border-white/30 px-1 font-mono text-[10px] font-normal opacity-80 min-[900px]:inline">⌘↵</kbd>}
    </button>
  );

  const exportBtn = (
    <div ref={exportRef} className="relative">
      <button type="button" aria-haspopup="menu" aria-expanded={exportOpen} onClick={() => setExportOpen((o) => !o)} className={`inline-flex h-9 items-center gap-1 rounded-lg border border-[#e3e8f0] bg-white px-3 text-[13px] font-medium hover:bg-[#f5f7fb] ${ring}`}>
        <Download className="size-4" aria-hidden /> Export <ChevronDown className="size-3.5 text-[#64708a]" aria-hidden />
      </button>
      {exportOpen && (
        <div role="menu" className="absolute right-0 top-full z-40 mt-1 w-40 rounded-lg border border-[#e3e8f0] bg-white p-1 text-[13px] shadow-lg max-[899px]:bottom-full max-[899px]:top-auto max-[899px]:mb-1">
          <button type="button" role="menuitem" onClick={() => exportAs("PNG")} className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 hover:bg-[#f5f7fb] ${ring}`}><FileImage className="size-4 text-[#64708a]" aria-hidden /> PNG</button>
          <button type="button" role="menuitem" onClick={() => exportAs("PDF")} className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 hover:bg-[#f5f7fb] ${ring}`}><FileText className="size-4 text-[#64708a]" aria-hidden /> PDF</button>
        </div>
      )}
    </div>
  );

  const saveBtn = (
    <button type="button" onClick={save} className={`inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#e3e8f0] bg-white px-3 text-[13px] font-medium hover:bg-[#f5f7fb] ${ring}`}>
      {saved ? <Check className="size-4 text-[#12b886]" aria-hidden /> : <Save className="size-4" aria-hidden />}
      {saved ? "Saved" : "Save"}
    </button>
  );

  const rightPanel = (
    <>
      <section aria-labelledby="mq-forecast" className="rounded-lg border border-[#e3e8f0] bg-white p-4">
        <h2 id="mq-forecast" className="text-[12px] font-semibold uppercase tracking-wider text-[#64708a]">Forecast</h2>
        <dl className="mt-3 flex flex-col gap-3">
          {forecast.map((r) => (
            <div key={r.key} className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1">
              <dt className="text-[13px] text-[#1f2a44]">{r.label}</dt>
              <dd className="flex items-center gap-2">
                <span className="text-[14px] font-semibold tabular-nums">{r.display}</span>
                <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-medium tabular-nums ${r.delta > 0 ? "bg-[#e6f7f1] text-[#0f7a5a]" : r.delta < 0 ? "bg-[#fdeaea] text-[#b91c1c]" : "bg-[#eef1f6] text-[#64708a]"}`}>
                  {r.delta > 0 ? <ArrowUpRight className="size-3" aria-hidden /> : r.delta < 0 ? <ArrowDownRight className="size-3" aria-hidden /> : <Minus className="size-3" aria-hidden />}
                  {r.delta > 0 ? "+" : ""}{r.delta}%
                </span>
              </dd>
              <dd className="col-span-2 flex h-6 items-end gap-[3px]" aria-hidden>
                {r.bars.map((h, i) => <span key={i} className="flex-1 rounded-[2px] transition-[height] duration-300 motion-reduce:transition-none" style={{ height: `${h * 100}%`, background: i === r.bars.length - 1 ? AMBER : BLUE, opacity: 0.35 + i * 0.065 }} />)}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-[11px] leading-snug text-[#64708a]">Deltas vs. concept {current.id} on Social with a plain voice. {ch.label} weight: reach ×{ch.reach}, CTR ×{ch.ctr}, conversion ×{ch.conv}.</p>
      </section>
      <section aria-labelledby="mq-activity" className="rounded-lg border border-[#e3e8f0] bg-white p-4">
        <div className="flex items-center justify-between">
          <h2 id="mq-activity" className="text-[12px] font-semibold uppercase tracking-wider text-[#64708a]">Activity</h2>
          <button type="button" onClick={() => { setActivity([]); setStatus("Activity cleared"); }} disabled={activity.length === 0} className={`rounded-md px-2 py-1 text-[12px] text-[#64708a] hover:bg-[#f5f7fb] hover:text-[#0b1220] disabled:opacity-40 ${ring}`}>Clear</button>
        </div>
        <p className="mt-2 text-[11px] font-medium text-[#94a0b8]">Today</p>
        <ol className="mt-1 flex flex-col">
          {activity.length === 0 && <li className="py-3 text-[12px] text-[#64708a]">No activity yet.</li>}
          {activity.map((a, i) => {
            const Icon = ACTIVITY_ICON[a.kind];
            return (
              <li key={a.id} className="relative flex gap-2.5 py-1.5 text-[13px]">
                <span className="relative flex w-5 shrink-0 justify-center">
                  <Icon className="relative z-10 size-4 rounded bg-white text-[#64708a]" aria-hidden />
                  {i < activity.length - 1 && <span className="absolute top-5 h-[calc(100%-4px)] w-px bg-[#e3e8f0]" aria-hidden />}
                </span>
                <span className="flex-1 leading-snug text-[#1f2a44]">{a.text}</span>
                <time className="text-[11px] tabular-nums text-[#94a0b8]" suppressHydrationWarning>{hhmm(a.at)}</time>
              </li>
            );
          })}
        </ol>
      </section>
    </>
  );

  return (
    <div className="flex min-h-dvh flex-col bg-[#f5f7fb] text-[13px] text-[#0b1220] antialiased">
      <style>{`
        @keyframes fable-mq-indeterminate { 0% { transform: translateX(-100%) } 100% { transform: translateX(300%) } }
        @keyframes fable-mq-sweep { 0% { transform: translateX(-100%) } 100% { transform: translateX(100%) } }
        .fable-mq-bar { animation: fable-mq-indeterminate 1.2s ease-in-out infinite; }
        .fable-mq-sweep { animation: fable-mq-sweep 1.1s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .fable-mq-bar, .fable-mq-sweep { animation: none; } }
      `}</style>

      {/* Top bar */}
      <header className="sticky top-0 z-30 flex h-[52px] items-center gap-3 border-b border-[#e3e8f0] bg-white px-3 sm:px-4">
        <span className="text-[15px] font-semibold tracking-tight">Muse</span>
        <span className="text-[#c4ccdb]" aria-hidden>/</span>
        {editingName ? (
          <input
            autoFocus
            aria-label="Campaign name"
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            onBlur={commitName}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitName();
              if (e.key === "Escape") { e.stopPropagation(); setDraftName(name); setEditingName(false); }
            }}
            className={`h-7 w-40 rounded-md border border-[#2f6bff] bg-white px-2 text-[13px] font-medium ${ring}`}
          />
        ) : (
          <button type="button" onClick={() => { setDraftName(name); setEditingName(true); }} title="Rename campaign" className={`h-7 rounded-md px-2 text-[13px] font-medium hover:bg-[#f5f7fb] ${ring}`}>{name}</button>
        )}
        <span className="hidden text-[#64708a] md:inline">Max Quality Chain</span>
        <span className="hidden items-center gap-1.5 lg:flex">
          <span className="rounded border border-[#e3e8f0] bg-[#f5f7fb] px-1.5 py-0.5 font-mono text-[11px]">Fable 5.1</span>
          <span className="rounded border border-[#e3e8f0] bg-[#f5f7fb] px-1.5 py-0.5 font-mono text-[11px]">frontend-design + ui-ux-pro-max + web-interface-guidelines + impeccable</span>
        </span>
        <div className="ml-auto flex items-center gap-2">
          <button type="button" onClick={() => setDrawer(true)} className={`inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#e3e8f0] bg-white px-3 text-[13px] font-medium min-[900px]:hidden ${ring}`}>
            <SlidersHorizontal className="size-4" aria-hidden /> Setup
          </button>
          <button type="button" onClick={(e) => openPalette(e.currentTarget)} aria-label="Open command palette" title="Command palette (⌘K)" className={`inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#e3e8f0] bg-white px-2.5 text-[13px] hover:bg-[#f5f7fb] ${ring}`}>
            <Command className="size-4" aria-hidden /><kbd className="hidden font-mono text-[11px] text-[#64708a] sm:inline">⌘K</kbd>
          </button>
          <button type="button" role="switch" aria-checked={compare} onClick={() => control(setCompare, !compare, `Compare ${compare ? "off" : "on"}`)} className={`hidden h-9 items-center gap-1.5 rounded-lg border px-3 text-[13px] font-medium min-[900px]:inline-flex ${ring} ${compare ? "border-[#2f6bff] bg-[#eef3ff] text-[#1f47b8]" : "border-[#e3e8f0] bg-white hover:bg-[#f5f7fb]"}`}>
            <Columns3 className="size-4" aria-hidden /> Compare
          </button>
          <div className="hidden items-center gap-2 min-[900px]:flex">{saveBtn}{exportBtn}{generateBtn()}</div>
        </div>
      </header>

      {/* Mobile badges row */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-[#e3e8f0] bg-white px-3 py-1.5 lg:hidden">
        <span className="rounded border border-[#e3e8f0] bg-[#f5f7fb] px-1.5 py-0.5 font-mono text-[11px]">Fable 5.1</span>
        <span className="rounded border border-[#e3e8f0] bg-[#f5f7fb] px-1.5 py-0.5 font-mono text-[11px]">frontend-design + ui-ux-pro-max + web-interface-guidelines + impeccable</span>
        <span className="text-[#64708a] md:hidden">Max Quality Chain</span>
      </div>

      {/* Workspace */}
      <div className="flex flex-1 min-h-0">
        {/* Left panel */}
        <aside aria-label="Setup" className={`hidden shrink-0 flex-col border-r border-[#e3e8f0] bg-white transition-[width] duration-200 motion-reduce:transition-none min-[900px]:flex ${collapsed ? "w-11" : "w-[280px]"}`}>
          <div className={`flex h-11 items-center border-b border-[#e3e8f0] ${collapsed ? "justify-center" : "justify-between pl-4 pr-2"}`}>
            {!collapsed && (
              <span className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-[#64708a]">
                Setup
                {error && <span className="inline-flex items-center gap-1 rounded-full bg-[#fdeaea] px-1.5 py-0.5 text-[10px] font-semibold normal-case tracking-normal text-[#b91c1c]"><AlertTriangle className="size-3" aria-hidden /> Error</span>}
              </span>
            )}
            <button type="button" onClick={() => setCollapsed((c) => !c)} aria-expanded={!collapsed} aria-label={collapsed ? "Expand setup panel" : "Collapse setup panel"} className={`flex size-7 items-center justify-center rounded-md text-[#64708a] hover:bg-[#f5f7fb] ${ring}`}>
              {collapsed ? <ChevronRight className="size-4" aria-hidden /> : <ChevronLeft className="size-4" aria-hidden />}
            </button>
          </div>
          {collapsed ? (
            <div className="flex flex-col items-center gap-1 py-2">
              {SECTIONS.map(({ icon: Icon, label }) => (
                <button key={label} type="button" onClick={() => setCollapsed(false)} aria-label={`Expand ${label}`} title={label} className={`flex size-8 items-center justify-center rounded-md text-[#64708a] hover:bg-[#f5f7fb] ${ring}`}><Icon className="size-4" aria-hidden /></button>
              ))}
              {error && <AlertTriangle className="mt-1 size-4 text-[#b91c1c]" aria-label="Setup has an error" />}
            </div>
          ) : (
            <div className="overflow-y-auto"><SetupPanel idp="mq" {...setupProps} /></div>
          )}
        </aside>

        {/* Center + right */}
        <div className="flex min-w-0 flex-1 flex-col min-[1200px]:flex-row">
          <main className="flex min-w-0 flex-1 flex-col gap-4 p-3 pb-32 sm:p-5 min-[900px]:pb-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div role="radiogroup" aria-label="Aspect ratio" className="inline-flex rounded-lg border border-[#e3e8f0] bg-white p-0.5">
                {RATIOS.map((r) => (
                  <button key={r.id} type="button" role="radio" aria-checked={ratio === r.id} onClick={() => control(setRatio, r.id, `Ratio → ${r.label}`)} className={`h-8 rounded-md px-3 text-[12px] font-medium transition-colors ${ring} ${ratio === r.id ? "bg-[#0b1220] text-white" : "text-[#64708a] hover:bg-[#f5f7fb]"}`}>{r.label}</button>
                ))}
              </div>
              <p className="text-[12px] text-[#64708a]">Concept {current.id} · {aud.label} · {ch.label} · {TONES.find((t) => t.id === tone)!.label}</p>
            </div>

            {compare ? (
              <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 min-[900px]:grid min-[900px]:grid-cols-3 min-[900px]:overflow-visible">
                {CONCEPTS.map((c) => (
                  <div key={c.id} className={`flex w-[78%] shrink-0 snap-center flex-col gap-2 rounded-xl p-2 min-[900px]:w-auto ${c.id === concept ? "ring-2 ring-[#2f6bff] ring-offset-2 ring-offset-[#f5f7fb]" : ""}`}>
                    <div className="flex items-center justify-between px-1 text-[12px]">
                      <span className="font-semibold">{c.id} · {c.name}</span>
                      {c.id === concept && <Check className="size-4 rounded-full bg-[#f5b544] p-0.5 text-[#0b1220]" aria-label="Selected" />}
                    </div>
                    {visual(c, true)}
                    <button type="button" onClick={() => select(c.id)} aria-pressed={c.id === concept} disabled={c.id === concept} className={`h-8 rounded-lg border text-[12px] font-medium ${ring} ${c.id === concept ? "border-[#2f6bff] bg-[#eef3ff] text-[#1f47b8]" : "border-[#e3e8f0] bg-white hover:bg-[#f5f7fb]"}`}>{c.id === concept ? "Selected" : "Select"}</button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mx-auto w-full" style={{ maxWidth: RATIOS.find((r) => r.id === ratio)!.max }}>{visual(current)}</div>
            )}

            <div role="radiogroup" aria-label="Concept" className="grid gap-2 min-[700px]:grid-cols-3">
              {CONCEPTS.map((c, i) => {
                const on = c.id === concept;
                const delta = Math.round(((c.base.ctr * ch.ctr) / (CONCEPTS[0].base.ctr * ch.ctr) - 1) * 100);
                return (
                  <button key={c.id} type="button" role="radio" aria-checked={on} onClick={() => select(c.id)} className={`flex items-center gap-3 rounded-lg border bg-white p-3 text-left transition-colors hover:bg-[#f9fbff] ${ring} ${on ? "border-[#2f6bff] ring-1 ring-[#2f6bff]" : "border-[#e3e8f0]"}`}>
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-md font-mono text-[13px] font-semibold text-white" style={{ background: c.accent }}>{c.id}</span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5 text-[13px] font-semibold">{c.name}{on && <Check className="size-3.5 rounded-full bg-[#f5b544] p-px text-[#0b1220]" aria-hidden />}</span>
                      <span className="block truncate text-[12px] text-[#64708a]">{c.angle}</span>
                    </span>
                    <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[11px] font-medium tabular-nums ${i === 0 ? "bg-[#eef1f6] text-[#64708a]" : delta >= 0 ? "bg-[#e6f7f1] text-[#0f7a5a]" : "bg-[#fdeaea] text-[#b91c1c]"}`}>{i === 0 ? "base" : `${delta >= 0 ? "+" : ""}${delta}% CTR`}</span>
                  </button>
                );
              })}
            </div>
          </main>

          <aside aria-label="Forecast and activity" className="grid gap-3 border-t border-[#e3e8f0] p-3 sm:grid-cols-2 sm:p-5 min-[1200px]:flex min-[1200px]:w-[300px] min-[1200px]:shrink-0 min-[1200px]:flex-col min-[1200px]:border-l min-[1200px]:border-t-0 min-[1200px]:p-4">
            {rightPanel}
          </aside>
        </div>
      </div>

      {/* Mobile action bar */}
      <div className="fixed inset-x-0 bottom-7 z-30 grid grid-cols-[1fr_1fr_1.8fr] gap-2 border-t border-[#e3e8f0] bg-white/95 p-3 backdrop-blur min-[900px]:hidden [&_button]:h-11">
        {saveBtn}{exportBtn}{generateBtn(true)}
      </div>

      {/* Status bar */}
      <footer className="sticky bottom-0 z-30 flex h-7 items-center gap-4 overflow-hidden border-t border-[#e3e8f0] bg-white px-3 text-[11px] text-[#64708a]">
        {loading && <div className="absolute inset-x-0 top-0 h-0.5 overflow-hidden" aria-hidden><div className="fable-mq-bar h-full w-1/3 bg-[#2f6bff]" /></div>}
        <span className="min-w-0 flex-1 truncate" aria-live="polite" role="status">{status}</span>
        <span className="hidden shrink-0 sm:inline">3 concepts · {RATIOS.find((r) => r.id === ratio)!.label.split(" ")[0]} · Compare {compare ? "on" : "off"}</span>
        <span className="hidden shrink-0 items-center gap-1.5 min-[900px]:flex" aria-label="Keyboard shortcuts">
          {["G", "S", "E", "1–3", "⌘↵", "⌘K"].map((k) => <kbd key={k} className="rounded border border-[#e3e8f0] bg-[#f5f7fb] px-1 font-mono text-[10px]">{k}</kbd>)}
        </span>
      </footer>

      {/* Toasts */}
      <div className="pointer-events-none fixed bottom-10 right-3 z-50 flex flex-col gap-2 min-[900px]:bottom-9" aria-live="polite">
        {toasts.map((t) => <ToastItem key={t.id} toast={t} onDismiss={dismissToast} />)}
      </div>

      {/* Command palette */}
      <CommandPalette open={palette} commands={commands} onClose={closePalette} />

      {/* Setup drawer (<900px) */}
      {drawer && (
        <div className="fixed inset-0 z-50 min-[900px]:hidden">
          <button type="button" aria-label="Close setup" onClick={() => setDrawer(false)} className="absolute inset-0 bg-[#0b1220]/40" />
          <div role="dialog" aria-modal="true" aria-label="Setup" className="absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col bg-white shadow-2xl">
            <div className="flex h-12 items-center justify-between border-b border-[#e3e8f0] pl-4 pr-2">
              <span className="text-[12px] font-semibold uppercase tracking-wider text-[#64708a]">Setup {error && <span className="ml-1 rounded-full bg-[#fdeaea] px-1.5 py-0.5 text-[10px] normal-case tracking-normal text-[#b91c1c]">Error</span>}</span>
              <button type="button" onClick={() => setDrawer(false)} aria-label="Close" className={`flex size-9 items-center justify-center rounded-md hover:bg-[#f5f7fb] ${ring}`}><X className="size-4" aria-hidden /></button>
            </div>
            <div className="flex-1 overflow-y-auto"><SetupPanel idp="mq-drawer" firstFieldRef={drawerFirst} {...setupProps} /></div>
            <div className="border-t border-[#e3e8f0] p-3">
              <button type="button" onClick={() => setDrawer(false)} className={`h-11 w-full rounded-lg bg-[#0b1220] text-[13px] font-semibold text-white ${ring}`}>Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
