"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import {
  BarChart3,
  Briefcase,
  Check,
  Clock,
  Download,
  Globe,
  LayoutDashboard,
  Loader2,
  Mail,
  MessageSquare,
  Nfc,
  RotateCcw,
  Save,
  Search,
  Settings,
  Sparkles,
  TriangleAlert,
  WandSparkles,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------------------------------- data ---------------------------------- */

type ConceptId = "A" | "B" | "C";
type Status = "idle" | "loading" | "success" | "error";
type ChannelId = "linkedin" | "email" | "web" | "search" | "x";
type ExportFormat = "PNG" | "PDF" | "CSV";
type ToastKind = "success" | "error";
type Toast = { id: number; kind: ToastKind; title: string; action?: "view" | "retry" };
type Activity = { id: number; who: string; text: string; time: string };
type Metrics = { reach: number; ctr: number; conv: number };

const AUDIENCES = ["Founders & ops leads", "Finance teams (10–200 seats)", "Agency owners", "Field sales teams"];
const TONES = ["Confident", "Plainspoken", "Witty", "Premium"] as const;
type Tone = (typeof TONES)[number];

const CHANNELS: { id: ChannelId; label: string; icon: LucideIcon; format: string }[] = [
  { id: "linkedin", label: "LinkedIn", icon: Briefcase, format: "1200 × 627 · Sponsored post" },
  { id: "email", label: "Email", icon: Mail, format: "600 wide · Launch email" },
  { id: "web", label: "Web", icon: Globe, format: "Responsive · Landing hero" },
  { id: "search", label: "Search", icon: Search, format: "RSA · 3 headlines" },
  { id: "x", label: "X", icon: MessageSquare, format: "1600 × 900 · Promoted" },
];

const STYLES = [
  { id: "steel", name: "Brushed steel", from: "#d4d4d8", to: "#71717a" },
  { id: "midnight", name: "Midnight", from: "#27272a", to: "#09090b" },
  { id: "paper", name: "Paper", from: "#fafaf9", to: "#d6d3d1" },
  { id: "signal", name: "Signal", from: "#0284c7", to: "#0c4a6e" },
];

const CONCEPTS: Record<
  ConceptId,
  { name: string; headline: string; sub: string; cta: string; tint: string; base: Metrics; hasForecast: boolean }
> = {
  A: {
    name: "Control",
    headline: "Spend, controlled.",
    sub: "Set limits per card, per merchant, per hour. Ledger enforces them before the swipe, not after the statement.",
    cta: "Get the card",
    tint: "#3f3f46",
    base: { reach: 182_000, ctr: 2.4, conv: 1.1 },
    hasForecast: true,
  },
  B: {
    name: "Team",
    headline: "Your team's card, on your terms.",
    sub: "Issue metal cards to everyone, keep one live view of spend, and approve exceptions from your phone.",
    cta: "Start issuing cards",
    tint: "#0369a1",
    base: { reach: 214_000, ctr: 3.1, conv: 1.6 },
    hasForecast: true,
  },
  C: {
    name: "Metal",
    headline: "Metal that pays attention.",
    sub: "14 grams of stainless steel with a rulebook inside. Real-time controls, instant receipts, zero surprises.",
    cta: "Reserve yours",
    tint: "#92400e",
    base: { reach: 156_000, ctr: 2.9, conv: 1.9 },
    hasForecast: false,
  },
};

const TONE_LINE: Record<Tone, string> = {
  Confident: "Built for teams that move fast and answer to the numbers.",
  Plainspoken: "One card per person. One rule set. No surprises at month end.",
  Witty: "The card that says no before your CFO has to.",
  Premium: "Precision-milled steel. Precision-managed spend.",
};

const CHANNEL_MULT: Record<ChannelId, Metrics> = {
  linkedin: { reach: 1, ctr: 1.1, conv: 1.15 },
  email: { reach: 0.6, ctr: 1.6, conv: 1.4 },
  web: { reach: 1.3, ctr: 0.8, conv: 0.9 },
  search: { reach: 0.8, ctr: 1.3, conv: 1.3 },
  x: { reach: 1.5, ctr: 0.7, conv: 0.6 },
};

const TONE_MULT: Record<Tone, Metrics> = {
  Confident: { reach: 1, ctr: 1, conv: 1 },
  Plainspoken: { reach: 1, ctr: 0.95, conv: 1.08 },
  Witty: { reach: 1.08, ctr: 1.15, conv: 0.9 },
  Premium: { reach: 0.94, ctr: 1.05, conv: 1.12 },
};

const BASELINE: Metrics = { reach: 160_000, ctr: 2.5, conv: 1.2 };

const COMMANDS: { id: string; label: string; hint?: string }[] = [
  { id: "generate", label: "Generate concept", hint: "G" },
  { id: "save", label: "Save draft", hint: "S" },
  { id: "export", label: "Export PNG", hint: "E" },
  ...(["A", "B", "C"] as ConceptId[]).map((c) => ({ id: `concept-${c}`, label: `Switch to concept ${c} · ${CONCEPTS[c].name}` })),
  ...CHANNELS.map((c) => ({ id: `channel-${c.id}`, label: `Set channel · ${c.label}` })),
];

const INITIAL_ACTIVITY: Activity[] = [
  { id: 3, who: "AM", text: "changed audience to Founders & ops leads", time: "09:41" },
  { id: 2, who: "MU", text: "generated concept A · Control", time: "09:38" },
  { id: 1, who: "JP", text: "created campaign “Ledger launch”", time: "09:12" },
];

function computeMetrics(concept: ConceptId, channel: ChannelId, tone: Tone, seed: number): Metrics {
  const b = CONCEPTS[concept].base;
  const c = CHANNEL_MULT[channel];
  const t = TONE_MULT[tone];
  const v = 1 + ((seed % 7) - 3) * 0.012;
  return {
    reach: Math.round((b.reach * c.reach * t.reach * v) / 1000) * 1000,
    ctr: Math.round(b.ctr * c.ctr * t.ctr * v * 10) / 10,
    conv: Math.round(b.conv * c.conv * t.conv * v * 100) / 100,
  };
}

function bars(seed: number): number[] {
  return Array.from({ length: 12 }, (_, i) => 30 + ((Math.sin(seed * 2.9 + i * 1.31) + 1) / 2) * 70);
}

function fmtReach(n: number) {
  return `${Math.round(n / 1000)}k`;
}

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/* ------------------------------- subcomponents ------------------------------ */

function RailButton({ icon: Icon, label, active }: { icon: LucideIcon; label: string; active?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex h-10 w-10 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2",
        active && "bg-sky-50 text-sky-700 hover:bg-sky-50 hover:text-sky-700",
      )}
    >
      <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
      <span
        role="tooltip"
        className="pointer-events-none absolute left-full top-1/2 z-20 ml-3 -translate-y-1/2 whitespace-nowrap rounded-md bg-zinc-900 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        {label}
      </span>
    </button>
  );
}

function ToastItem({ toast, onDismiss, onAction }: { toast: Toast; onDismiss: (id: number) => void; onAction: (t: Toast) => void }) {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => onDismiss(toast.id), 5000);
    return () => clearTimeout(t);
  }, [paused, toast.id, onDismiss]);
  const isError = toast.kind === "error";
  return (
    <div
      role="status"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={cn(
        "pointer-events-auto flex w-[320px] max-w-[calc(100vw-2rem)] items-center gap-3 rounded-lg border bg-white p-3 text-[13px] shadow-lg",
        isError ? "border-red-200 bg-red-50 text-red-900" : "border-zinc-200 text-zinc-900",
      )}
    >
      {isError ? <TriangleAlert className="h-4 w-4 shrink-0 text-red-600" /> : <Check className="h-4 w-4 shrink-0 text-emerald-600" />}
      <span className="flex-1 leading-snug">{toast.title}</span>
      {toast.action && (
        <button
          type="button"
          onClick={() => onAction(toast)}
          className={cn(
            "rounded-md px-2 py-1 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
            isError ? "text-red-700 hover:bg-red-100 focus-visible:ring-red-500" : "text-sky-700 hover:bg-sky-50 focus-visible:ring-sky-600",
          )}
        >
          {toast.action === "view" ? "View" : "Retry"}
        </button>
      )}
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => onDismiss(toast.id)}
        className="rounded-md p-1 text-zinc-400 hover:text-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function Kpi({ label, value, delta, seed, loading }: { label: string; value: string; delta: number; seed: number; loading: boolean }) {
  const up = delta >= 0;
  return (
    <div className="min-w-[240px] snap-start rounded-lg border border-zinc-200 bg-white p-4 transition-shadow hover:shadow-md lg:min-w-0">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[13px] text-zinc-500">{label}</p>
          {loading ? (
            <div className="mt-1 h-7 w-20 animate-pulse rounded bg-zinc-200" />
          ) : (
            <p className="mt-0.5 text-2xl font-semibold tracking-tight text-zinc-950">{value}</p>
          )}
        </div>
        <span
          className={cn(
            "rounded-md px-1.5 py-0.5 text-xs font-medium tabular-nums",
            up ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700",
          )}
        >
          {up ? "▲" : "▼"} {Math.abs(delta).toFixed(1)}% vs baseline
        </span>
      </div>
      <div className="mt-3 flex h-10 items-end gap-1" aria-hidden="true">
        {bars(seed).map((h, i) => (
          <div
            key={i}
            className={cn("flex-1 rounded-sm", i === 11 ? "bg-sky-600" : "bg-zinc-200")}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------- page ---------------------------------- */

export default function UxProReference() {
  const [brief, setBrief] = useState(
    "Launch Ledger, a metal credit card with real-time spend controls for small teams. Lead with control, prove it with speed, and make finance leads feel like the hero.",
  );
  const [audience, setAudience] = useState(AUDIENCES[0]);
  const [channel, setChannel] = useState<ChannelId>("linkedin");
  const [tone, setTone] = useState<Tone>("Confident");
  const [style, setStyle] = useState(STYLES[0].id);
  const [concept, setConcept] = useState<ConceptId>("B");
  const [status, setStatus] = useState<Status>("idle");
  const [seed, setSeed] = useState(2);
  const [saved, setSaved] = useState<string | null>("09:41");
  const [exportFormat, setExportFormat] = useState<ExportFormat>("PNG");
  const [exportProgress, setExportProgress] = useState<number | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [activity, setActivity] = useState<Activity[]>(INITIAL_ACTIVITY);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const [audienceOpen, setAudienceOpen] = useState(false);

  const generateCount = useRef(0);
  const idRef = useRef(100);
  const timers = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const previewRef = useRef<HTMLDivElement>(null);
  const paletteInput = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
        setQuery("");
        setCursor(0);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (paletteOpen) paletteInput.current?.focus();
  }, [paletteOpen]);

  const log = useCallback((text: string, who = "You") => {
    setActivity((a) => [{ id: ++idRef.current, who: who === "You" ? "YO" : who, text, time: nowTime() }, ...a].slice(0, 8));
  }, []);

  const pushToast = useCallback((kind: ToastKind, title: string, action?: Toast["action"]) => {
    setToasts((t) => [...t, { id: ++idRef.current, kind, title, action }]);
  }, []);

  const dismissToast = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const touch = () => setSaved(null);

  /* Error rule: brief under 20 characters fails immediately; otherwise every 4th generate fails. */
  const generate = useCallback(() => {
    if (status === "loading") return;
    generateCount.current += 1;
    const started = performance.now();
    setStatus("loading");
    log("started generating a concept");
    after(1400, () => {
      const fails = brief.trim().length < 20 || generateCount.current % 4 === 0;
      if (fails) {
        setStatus("error");
        pushToast("error", brief.trim().length < 20 ? "Brief is too short to generate from" : "Generation failed · model timed out", "retry");
        log("generation failed");
        return;
      }
      const next: ConceptId = concept === "A" ? "B" : concept === "B" ? "C" : "A";
      setConcept(next);
      setSeed((s) => s + 1);
      setStatus("success");
      setSaved(null);
      const secs = ((performance.now() - started) / 1000).toFixed(1);
      pushToast("success", `Concept ${next} generated · ${secs}s`, "view");
      log(`generated concept ${next} · ${CONCEPTS[next].name}`, "MU");
    });
  }, [status, brief, concept, after, log, pushToast]);

  const save = useCallback(() => {
    const t = nowTime();
    setSaved(t);
    pushToast("success", "Draft saved");
    log("saved the draft");
  }, [log, pushToast]);

  const runExport = useCallback(
    (format: ExportFormat) => {
      if (exportProgress !== null) return;
      setExportProgress(0);
      let p = 0;
      const step = () => {
        p += 20;
        if (p >= 100) {
          setExportProgress(100);
          after(250, () => {
            setExportProgress(null);
            pushToast("success", `Exported concept ${concept} as ${format}`);
            log(`exported concept ${concept} as ${format}`);
          });
          return;
        }
        setExportProgress(p);
        after(180, step);
      };
      after(180, step);
    },
    [after, concept, exportProgress, log, pushToast],
  );

  const selectConcept = (id: ConceptId) => {
    if (id === concept) return;
    setConcept(id);
    touch();
    log(`switched to concept ${id} · ${CONCEPTS[id].name}`);
  };

  const setChannelAnd = (id: ChannelId) => {
    setChannel(id);
    touch();
    log(`set channel to ${CHANNELS.find((c) => c.id === id)?.label}`);
  };

  const filtered = COMMANDS.filter((c) => c.label.toLowerCase().includes(query.trim().toLowerCase()));
  const activeCursor = Math.min(cursor, Math.max(filtered.length - 1, 0));

  const closePalette = () => {
    setPaletteOpen(false);
    setQuery("");
    setCursor(0);
  };

  const runCommand = (i: number) => {
    const cmd = filtered[i];
    closePalette();
    if (!cmd) return;
    if (cmd.id === "generate") generate();
    else if (cmd.id === "save") save();
    else if (cmd.id === "export") runExport("PNG");
    else if (cmd.id.startsWith("concept-")) selectConcept(cmd.id.slice(8) as ConceptId);
    else if (cmd.id.startsWith("channel-")) setChannelAnd(cmd.id.slice(8) as ChannelId);
  };

  const onPaletteKey = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closePalette();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      runCommand(activeCursor);
    } else if (e.key === "Tab") {
      e.preventDefault(); // focus stays on the input while the palette is open
    }
  };

  const onToastAction = (t: Toast) => {
    dismissToast(t.id);
    if (t.action === "view") previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (t.action === "retry") generate();
  };

  const current = CONCEPTS[concept];
  const metrics = computeMetrics(concept, channel, tone, seed);
  const delta = (k: keyof Metrics) => ((metrics[k] - BASELINE[k]) / BASELINE[k]) * 100;
  const channelMeta = CHANNELS.find((c) => c.id === channel)!;
  const styleMeta = STYLES.find((s) => s.id === style)!;
  const loading = status === "loading";
  const briefTooShort = brief.trim().length < 20;

  const rail = [
    { icon: LayoutDashboard, label: "Dashboard" },
    { icon: Sparkles, label: "Studio", active: true },
    { icon: BarChart3, label: "Forecasts" },
    { icon: Clock, label: "History" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <div className="min-h-dvh bg-[#fbfbfc] text-[13px] text-zinc-950 antialiased">
      {/* Icon rail (desktop) */}
      <nav
        aria-label="Primary"
        className="fixed inset-y-0 left-0 z-30 hidden w-14 flex-col items-center gap-1 border-r border-zinc-200 bg-white pt-3 lg:flex"
      >
        <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-950 text-sm font-bold text-white" aria-label="Muse">
          M
        </div>
        {rail.map((r) => (
          <RailButton key={r.label} icon={r.icon} label={r.label} active={r.active} />
        ))}
      </nav>

      {/* Bottom tab bar (mobile) */}
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-zinc-200 bg-white/95 backdrop-blur lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {rail.map((r) => (
          <button
            key={r.label}
            type="button"
            aria-label={r.label}
            aria-current={r.active ? "page" : undefined}
            className={cn(
              "flex h-14 flex-col items-center justify-center gap-1 text-[11px] text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-600",
              r.active && "text-sky-700",
            )}
          >
            <r.icon className="h-5 w-5" strokeWidth={1.75} />
            {r.label}
          </button>
        ))}
      </nav>

      <div className="lg:pl-14">
        {/* Top bar */}
        <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/95 backdrop-blur">
          <div className="flex flex-col gap-3 px-4 py-3 lg:h-14 lg:flex-row lg:items-center lg:gap-4 lg:py-0 lg:px-6">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-950 text-sm font-bold text-white lg:hidden">M</div>
              <div className="min-w-0">
                <nav aria-label="Breadcrumb" className="truncate text-xs text-zinc-500">
                  Muse <span aria-hidden="true">›</span> Campaigns <span aria-hidden="true">›</span>{" "}
                  <span className="text-zinc-900">Ledger launch</span>
                </nav>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-sm font-semibold">UX Pro Reference</h1>
                  <span className="rounded-md border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 text-[11px] font-medium text-zinc-700">Fable 5.1</span>
                  <span className="rounded-md border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 font-mono text-[11px] text-zinc-700">ui-ux-pro-max</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPaletteOpen(true)}
                className="flex h-9 flex-1 items-center gap-2 rounded-lg border border-zinc-200 bg-[#fbfbfc] px-3 text-zinc-500 transition-colors hover:border-zinc-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 lg:w-72 lg:flex-none"
              >
                <Search className="h-4 w-4" />
                <span className="flex-1 truncate text-left">Search or run a command</span>
                <kbd className="rounded border border-zinc-200 bg-white px-1.5 py-0.5 font-mono text-[11px] text-zinc-500">⌘K</kbd>
              </button>
              <button
                type="button"
                onClick={generate}
                disabled={loading}
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-sky-600 px-3.5 font-medium text-white shadow-sm transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <WandSparkles className="h-4 w-4" />}
                {loading ? "Generating…" : "Generate"}
              </button>
            </div>
          </div>
        </header>

        <p className="sr-only" aria-live="polite">
          {status === "loading" && "Generating a concept."}
          {status === "success" && `Concept ${concept} is ready.`}
          {status === "error" && "Generation failed."}
        </p>

        <main className="mx-auto max-w-[1400px] space-y-4 px-4 pb-24 pt-4 lg:px-6 lg:pb-8">
          {/* KPI row */}
          <section aria-label="Forecast" className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0">
            <Kpi label="Reach" value={fmtReach(metrics.reach)} delta={delta("reach")} seed={seed + 1} loading={loading} />
            <Kpi label="CTR" value={`${metrics.ctr.toFixed(1)}%`} delta={delta("ctr")} seed={seed + 2} loading={loading} />
            <Kpi label="Conversion" value={`${metrics.conv.toFixed(2)}%`} delta={delta("conv")} seed={seed + 3} loading={loading} />
          </section>

          <div className="grid gap-4 lg:grid-cols-12">
            {/* Preview */}
            <section ref={previewRef} aria-labelledby="preview-title" className="scroll-mt-20 lg:col-span-7">
              <div className="rounded-lg border border-zinc-200 bg-white transition-shadow hover:shadow-md">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 px-4 pt-3">
                  <h2 id="preview-title" className="pb-3 text-sm font-semibold">
                    Preview
                  </h2>
                  <div role="tablist" aria-label="Variant" className="flex gap-1">
                    {(["A", "B", "C"] as ConceptId[]).map((id) => {
                      const selected = id === concept;
                      return (
                        <button
                          key={id}
                          role="tab"
                          type="button"
                          aria-selected={selected}
                          tabIndex={selected ? 0 : -1}
                          onClick={() => selectConcept(id)}
                          onKeyDown={(e) => {
                            const order: ConceptId[] = ["A", "B", "C"];
                            const i = order.indexOf(concept);
                            if (e.key === "ArrowRight") selectConcept(order[(i + 1) % 3]);
                            if (e.key === "ArrowLeft") selectConcept(order[(i + 2) % 3]);
                          }}
                          className={cn(
                            "relative -mb-px flex items-center gap-1.5 border-b-2 px-3 pb-3 pt-1 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-1",
                            selected ? "border-sky-600 text-sky-700" : "border-transparent text-zinc-500 hover:text-zinc-900",
                          )}
                        >
                          Variant {id}
                          {CONCEPTS[id].hasForecast && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" title="Has forecast" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Browser mock */}
                <div className="p-4">
                  <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50">
                    <div className="flex items-center gap-2 border-b border-zinc-200 bg-white px-3 py-2">
                      <span className="flex gap-1" aria-hidden="true">
                        <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
                        <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
                        <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
                      </span>
                      <span className="flex-1 truncate rounded-md bg-zinc-100 px-2 py-1 font-mono text-[11px] text-zinc-600">
                        ledger.co/launch?utm={channel}&v={concept.toLowerCase()}
                      </span>
                      <span className="hidden text-[11px] text-zinc-500 sm:block">{channelMeta.format}</span>
                    </div>
                    <div className="grid gap-6 p-6 sm:grid-cols-2 sm:items-center sm:p-8" style={{ background: `linear-gradient(135deg, ${styleMeta.from}22, ${current.tint}14)` }}>
                      <div>
                        <p className="mb-2 text-[11px] font-medium uppercase tracking-wider" style={{ color: current.tint }}>
                          Ledger · {audience}
                        </p>
                        {loading ? (
                          <div className="space-y-2">
                            <div className="h-8 w-4/5 animate-pulse rounded bg-zinc-200" />
                            <div className="h-8 w-3/5 animate-pulse rounded bg-zinc-200" />
                            <div className="mt-3 h-4 w-full animate-pulse rounded bg-zinc-200" />
                            <div className="h-4 w-11/12 animate-pulse rounded bg-zinc-200" />
                            <div className="mt-4 h-9 w-32 animate-pulse rounded-lg bg-zinc-200" />
                          </div>
                        ) : (
                          <>
                            <h3 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">{current.headline}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-zinc-600">{current.sub}</p>
                            <p className="mt-2 text-xs italic text-zinc-500">{TONE_LINE[tone]}</p>
                            <span className="mt-4 inline-flex h-9 items-center rounded-lg px-4 text-sm font-medium text-white" style={{ backgroundColor: current.tint }}>
                              {current.cta}
                            </span>
                          </>
                        )}
                      </div>
                      {/* Metal card */}
                      <div className="mx-auto w-full max-w-[300px]">
                        {loading ? (
                          <div className="aspect-[1.586] animate-pulse rounded-xl bg-zinc-200" />
                        ) : (
                          <div
                            className="relative aspect-[1.586] rounded-xl p-4 text-white shadow-xl ring-1 ring-black/10"
                            style={{
                              background: `linear-gradient(135deg, ${styleMeta.from} 0%, ${current.tint} 55%, ${styleMeta.to} 100%)`,
                            }}
                          >
                            <div className="absolute inset-0 rounded-xl bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.05)_0_1px,transparent_1px_3px)] mix-blend-overlay" aria-hidden="true" />
                            <div className="relative flex h-full flex-col justify-between">
                              <div className="flex items-start justify-between">
                                <span className="text-xs font-semibold tracking-[0.2em] drop-shadow">LEDGER</span>
                                <Nfc className="h-4 w-4 opacity-80" />
                              </div>
                              <div className="h-7 w-9 rounded-md border border-yellow-200/60 bg-gradient-to-br from-yellow-100 to-yellow-500 shadow-inner" aria-hidden="true" />
                              <div className="flex items-end justify-between">
                                <span className="font-mono text-[11px] tracking-[0.25em] opacity-90">•••• 4021</span>
                                <span className="text-[10px] uppercase tracking-wider opacity-80">Team · {concept}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Brief & targeting */}
            <section aria-labelledby="brief-title" className="lg:col-span-5">
              <div className="flex h-full flex-col rounded-lg border border-zinc-200 bg-white transition-shadow hover:shadow-md">
                <div className="border-b border-zinc-200 px-4 py-3">
                  <h2 id="brief-title" className="text-sm font-semibold">
                    Brief & targeting
                  </h2>
                </div>
                <div className="flex-1 space-y-4 p-4">
                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <label htmlFor="brief" className="font-medium">
                        Campaign brief
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setBrief((b) => `${b.trim()} Emphasize instant card freezes and per-merchant limits as the proof points.`);
                          touch();
                          log("improved the brief with AI");
                        }}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-sky-700 hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
                      >
                        <Sparkles className="h-3.5 w-3.5" /> Improve with AI
                      </button>
                    </div>
                    <textarea
                      id="brief"
                      rows={4}
                      value={brief}
                      onChange={(e) => {
                        setBrief(e.target.value);
                        touch();
                      }}
                      aria-invalid={status === "error" && briefTooShort}
                      aria-describedby="brief-help"
                      className={cn(
                        "w-full resize-y rounded-lg border bg-white px-3 py-2 leading-relaxed text-zinc-900 placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600",
                        status === "error" && briefTooShort ? "border-red-400" : "border-zinc-200",
                      )}
                    />
                    <p id="brief-help" className={cn("mt-1 text-xs", status === "error" && briefTooShort ? "text-red-600" : "text-zinc-500")}>
                      {status === "error" && briefTooShort ? "Add at least 20 characters so the model has something to work with." : `${brief.trim().length} characters · minimum 20`}
                    </p>
                  </div>

                  {/* Audience combobox */}
                  <div className="relative">
                    <label id="audience-label" className="mb-1.5 block font-medium">
                      Audience
                    </label>
                    <button
                      type="button"
                      role="combobox"
                      aria-labelledby="audience-label"
                      aria-expanded={audienceOpen}
                      aria-controls="audience-list"
                      aria-haspopup="listbox"
                      onClick={() => setAudienceOpen((o) => !o)}
                      onKeyDown={(e) => e.key === "Escape" && setAudienceOpen(false)}
                      className="flex h-9 w-full items-center justify-between rounded-lg border border-zinc-200 bg-white px-3 text-left hover:border-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
                    >
                      {audience}
                      <span aria-hidden="true" className="text-zinc-400">
                        ▾
                      </span>
                    </button>
                    {audienceOpen && (
                      <ul
                        id="audience-list"
                        role="listbox"
                        aria-labelledby="audience-label"
                        className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-zinc-200 bg-white p-1 shadow-lg"
                      >
                        {AUDIENCES.map((a) => (
                          <li key={a}>
                            <button
                              type="button"
                              role="option"
                              aria-selected={a === audience}
                              onClick={() => {
                                setAudience(a);
                                setAudienceOpen(false);
                                touch();
                                log(`changed audience to ${a}`);
                              }}
                              className={cn(
                                "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-600",
                                a === audience && "text-sky-700",
                              )}
                            >
                              {a}
                              {a === audience && <Check className="h-4 w-4" />}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Channel toggle group */}
                  <div>
                    <p id="channel-label" className="mb-1.5 font-medium">
                      Channel
                    </p>
                    <div role="group" aria-labelledby="channel-label" className="grid grid-cols-5 gap-1 rounded-lg border border-zinc-200 bg-zinc-50 p-1">
                      {CHANNELS.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          aria-pressed={c.id === channel}
                          aria-label={c.label}
                          title={c.label}
                          onClick={() => setChannelAnd(c.id)}
                          className={cn(
                            "flex h-8 items-center justify-center rounded-md text-zinc-500 transition-colors hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600",
                            c.id === channel && "bg-white text-sky-700 shadow-sm ring-1 ring-zinc-200",
                          )}
                        >
                          <c.icon className="h-4 w-4" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tone pills */}
                  <fieldset>
                    <legend className="mb-1.5 font-medium">Tone</legend>
                    <div className="flex flex-wrap gap-1.5">
                      {TONES.map((t) => (
                        <label
                          key={t}
                          className={cn(
                            "cursor-pointer rounded-full border px-3 py-1 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-sky-600 has-[:focus-visible]:ring-offset-1",
                            t === tone ? "border-sky-600 bg-sky-50 text-sky-700" : "border-zinc-200 text-zinc-600 hover:border-zinc-300",
                          )}
                        >
                          <input
                            type="radio"
                            name="tone"
                            value={t}
                            checked={t === tone}
                            onChange={() => {
                              setTone(t);
                              touch();
                              log(`set tone to ${t}`);
                            }}
                            className="sr-only"
                          />
                          {t}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  {/* Visual style */}
                  <fieldset>
                    <legend className="mb-1.5 font-medium">Visual style</legend>
                    <div className="grid grid-cols-2 gap-2">
                      {STYLES.map((s) => (
                        <label
                          key={s.id}
                          className={cn(
                            "flex cursor-pointer items-center gap-2 rounded-lg border p-2 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-sky-600 has-[:focus-visible]:ring-offset-1",
                            s.id === style ? "border-sky-600 bg-sky-50/50" : "border-zinc-200 hover:border-zinc-300",
                          )}
                        >
                          <input
                            type="radio"
                            name="style"
                            value={s.id}
                            checked={s.id === style}
                            onChange={() => {
                              setStyle(s.id);
                              touch();
                              log(`set visual style to ${s.name}`);
                            }}
                            className="sr-only"
                          />
                          <span className="h-6 w-6 shrink-0 rounded-md ring-1 ring-black/10" style={{ background: `linear-gradient(135deg, ${s.from}, ${s.to})` }} aria-hidden="true" />
                          <span className="truncate">{s.name}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </div>
                <div className="flex items-center justify-between border-t border-zinc-200 px-4 py-3">
                  <span className="text-xs text-zinc-500">{saved ? `Saved · ${saved}` : "Unsaved changes"}</span>
                  <button
                    type="button"
                    onClick={save}
                    disabled={!!saved}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 font-medium text-zinc-900 transition-colors hover:bg-zinc-50 disabled:cursor-default disabled:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
                  >
                    {saved ? <Check className="h-4 w-4 text-emerald-600" /> : <Save className="h-4 w-4" />}
                    {saved ? "Saved" : "Save"}
                  </button>
                </div>
              </div>
            </section>

            {/* Activity */}
            <section aria-labelledby="activity-title" className="lg:col-span-7">
              <div className="rounded-lg border border-zinc-200 bg-white transition-shadow hover:shadow-md">
                <div className="border-b border-zinc-200 px-4 py-3">
                  <h2 id="activity-title" className="text-sm font-semibold">
                    Activity
                  </h2>
                </div>
                <ol className="p-4">
                  {activity.map((a, i) => (
                    <li key={a.id} className="relative flex gap-3 pb-4 last:pb-0">
                      {i < activity.length - 1 && <span className="absolute left-3.5 top-8 h-[calc(100%-1.5rem)] w-px bg-zinc-200" aria-hidden="true" />}
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-[10px] font-semibold text-zinc-700 ring-1 ring-zinc-200">{a.who}</span>
                      <div className="min-w-0 flex-1 pt-1">
                        <p className="text-zinc-900">
                          <span className="font-medium">{a.who === "YO" ? "You" : a.who === "MU" ? "Muse" : a.who}</span> {a.text}
                        </p>
                      </div>
                      <time className="pt-1 text-xs tabular-nums text-zinc-500">{a.time}</time>
                    </li>
                  ))}
                </ol>
              </div>
            </section>

            {/* Export */}
            <section aria-labelledby="export-title" className="lg:col-span-5">
              <div className="flex h-full flex-col rounded-lg border border-zinc-200 bg-white transition-shadow hover:shadow-md">
                <div className="border-b border-zinc-200 px-4 py-3">
                  <h2 id="export-title" className="text-sm font-semibold">
                    Export
                  </h2>
                </div>
                <div className="flex flex-1 flex-col gap-4 p-4">
                  <fieldset>
                    <legend className="mb-1.5 font-medium">Format</legend>
                    <div className="grid grid-cols-3 gap-2">
                      {(["PNG", "PDF", "CSV"] as ExportFormat[]).map((f) => (
                        <label
                          key={f}
                          className={cn(
                            "flex cursor-pointer items-center justify-center gap-2 rounded-lg border py-2 font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-sky-600 has-[:focus-visible]:ring-offset-1",
                            f === exportFormat ? "border-sky-600 bg-sky-50 text-sky-700" : "border-zinc-200 text-zinc-600 hover:border-zinc-300",
                          )}
                        >
                          <input type="radio" name="format" value={f} checked={f === exportFormat} onChange={() => setExportFormat(f)} className="sr-only" />
                          {f}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <p className="text-xs text-zinc-500">
                    {exportFormat === "CSV" ? "Forecast table for concepts A–C with channel multipliers." : `Concept ${concept} at ${channelMeta.format.split(" · ")[0]}, ready for ${channelMeta.label}.`}
                  </p>
                  <div className="mt-auto space-y-2">
                    {exportProgress !== null && (
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100" role="progressbar" aria-valuenow={exportProgress} aria-valuemin={0} aria-valuemax={100} aria-label="Export progress">
                        <div className="h-full rounded-full bg-sky-600 transition-[width] duration-200" style={{ width: `${exportProgress}%` }} />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => runExport(exportFormat)}
                      disabled={exportProgress !== null}
                      className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white font-medium text-zinc-900 transition-colors hover:bg-zinc-50 disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
                    >
                      {exportProgress !== null ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                      {exportProgress !== null ? `Exporting ${exportProgress}%` : `Export ${exportFormat}`}
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* Command palette */}
      {paletteOpen && (
        <div className="fixed inset-0 z-40 flex items-start justify-center bg-zinc-950/30 p-4 pt-[12vh] sm:pt-[18vh]" onMouseDown={closePalette}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            onMouseDown={(e) => e.stopPropagation()}
            className="w-full max-w-[560px] overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-2xl"
          >
            <div className="flex items-center gap-2 border-b border-zinc-200 px-3">
              <Search className="h-4 w-4 text-zinc-400" />
              <input
                ref={paletteInput}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setCursor(0);
                }}
                onKeyDown={onPaletteKey}
                placeholder="Type a command…"
                aria-label="Search commands"
                aria-controls="palette-list"
                aria-activedescendant={filtered[activeCursor] ? `cmd-${filtered[activeCursor].id}` : undefined}
                className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400"
              />
              <kbd className="rounded border border-zinc-200 px-1.5 py-0.5 font-mono text-[11px] text-zinc-500">esc</kbd>
            </div>
            <ul id="palette-list" role="listbox" aria-label="Commands" className="max-h-[320px] overflow-y-auto p-1">
              {filtered.length === 0 && <li className="px-3 py-6 text-center text-zinc-500">No commands match “{query}”</li>}
              {filtered.map((c, i) => (
                <li key={c.id} id={`cmd-${c.id}`} role="option" aria-selected={i === activeCursor}>
                  <button
                    type="button"
                    tabIndex={-1}
                    onMouseEnter={() => setCursor(i)}
                    onClick={() => runCommand(i)}
                    className={cn("flex w-full items-center justify-between rounded-md px-3 py-2 text-left", i === activeCursor ? "bg-sky-50 text-sky-800" : "text-zinc-800")}
                  >
                    {c.label}
                    {c.hint && <kbd className="rounded border border-zinc-200 bg-white px-1.5 font-mono text-[11px] text-zinc-500">{c.hint}</kbd>}
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-3 border-t border-zinc-200 px-3 py-2 text-[11px] text-zinc-500">
              <span>↑↓ navigate</span>
              <span>⏎ run</span>
              <span>esc close</span>
            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="pointer-events-none fixed bottom-20 right-4 z-50 flex flex-col items-end gap-2 lg:bottom-4">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismissToast} onAction={onToastAction} />
        ))}
        {status === "error" && toasts.length === 0 && (
          <button
            type="button"
            onClick={generate}
            className="pointer-events-auto inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-700 shadow-md hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Retry last generation
          </button>
        )}
      </div>
    </div>
  );
}
