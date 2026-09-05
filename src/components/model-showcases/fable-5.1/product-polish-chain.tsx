"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  Download,
  FileImage,
  FileText,
  Info,
  Keyboard,
  Link2,
  Loader2,
  MousePointerClick,
  Save,
  SlidersHorizontal,
  Sparkles,
  Undo2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

/* ---------------------------------- data ---------------------------------- */

type ConceptId = "A" | "B" | "C";
type Device = "desktop" | "tablet" | "mobile";
type Tone = "direct" | "warm" | "witty";
type Style = "mono" | "pastel" | "deep" | "grid";

type Concept = {
  id: ConceptId;
  name: string;
  angle: string;
  accent: string;
  headlines: [string, string];
  columns: number[];
  base: { reach: number; ctr: number; conv: number };
};

const CONCEPTS: Concept[] = [
  { id: "A", name: "Quiet Board", angle: "Less dashboard, more done", accent: "#6d5dfc", headlines: ["Tracking that stays out of the way.", "Your week, on one calm board."], columns: [3, 2, 2], base: { reach: 31200, ctr: 1.9, conv: 3.4 } },
  { id: "B", name: "Studio Leads", angle: "See every project from the doorway", accent: "#0f9d8f", headlines: ["Every project, one glance.", "Know what's late before the client does."], columns: [2, 3, 2], base: { reach: 42800, ctr: 2.6, conv: 2.8 } },
  { id: "C", name: "Friday Ship", angle: "Ship on Fridays without the fear", accent: "#ef6c2b", headlines: ["Ship on Friday. Sleep on Saturday.", "Deadlines you can see coming."], columns: [2, 2, 3], base: { reach: 36900, ctr: 3.1, conv: 2.2 } },
];

const AUDIENCES = [
  { value: "studios", label: "Design studios" },
  { value: "agencies", label: "Indie agencies" },
  { value: "collectives", label: "Freelance collectives" },
  { value: "inhouse", label: "In-house teams" },
];

const CHANNELS = [
  { value: "linkedin", label: "LinkedIn", reach: 1, ctr: 1, conv: 1 },
  { value: "producthunt", label: "Product Hunt", reach: 0.7, ctr: 1.6, conv: 1.3 },
  { value: "newsletter", label: "Newsletter", reach: 0.35, ctr: 2.1, conv: 1.7 },
  { value: "x", label: "X", reach: 1.4, ctr: 0.8, conv: 0.7 },
];

const TONES: { id: Tone; label: string }[] = [
  { id: "direct", label: "Direct" },
  { id: "warm", label: "Warm" },
  { id: "witty", label: "Witty" },
];

const STYLES: { id: Style; label: string; bg: string; card: string; ink: string }[] = [
  { id: "mono", label: "Mono", bg: "#fafafa", card: "#ffffff", ink: "#18181b" },
  { id: "pastel", label: "Pastel", bg: "#f4f1ff", card: "#ffffff", ink: "#2a2450" },
  { id: "deep", label: "Deep", bg: "#0f1117", card: "#1a1d27", ink: "#f4f4f5" },
  { id: "grid", label: "Grid", bg: "#f7f7f5", card: "#ffffff", ink: "#1c1c1a" },
];

const SUB: Record<Tone, string> = {
  direct: "Orbit is project tracking for small studios. Boards, timelines and client updates in one place, without the admin.",
  warm: "Orbit keeps small studios in sync: the board everyone actually opens, the updates clients actually read.",
  witty: "Orbit: project tracking for studios that would rather be designing than updating a spreadsheet about designing.",
};

const CTA: Record<Tone, string> = { direct: "Start free trial", warm: "Try Orbit with your team", witty: "Close the spreadsheet" };

const FRAME: Record<Device, string> = { desktop: "100%", tablet: "768px", mobile: "390px" };

const BRIEF_MIN = 20;
const BRIEF_MAX = 400;

type Snapshot = { concept: ConceptId; audience: string; channel: string; tone: Tone; style: Style };
type HistoryEntry = { label: string; snapshot: Snapshot };
type ActivityKind = "generate" | "save" | "export" | "select" | "control";
type Activity = { id: number; kind: ActivityKind; text: string; at: number };

const ACTIVITY_ICON: Record<ActivityKind, typeof Sparkles> = {
  generate: Sparkles,
  save: Save,
  export: Download,
  select: MousePointerClick,
  control: SlidersHorizontal,
};

/** Wall-clock read, only ever invoked from event handlers. */
function stamp() {
  return Date.now();
}

function hhmm(at: number) {
  return new Date(at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/* ------------------------------- component -------------------------------- */

export default function ProductPolishChain() {
  const [brief, setBrief] = useState("Launch Orbit for small design studios: a project tracker that replaces the status spreadsheet and the Friday scramble.");
  const [concept, setConcept] = useState<ConceptId>("B");
  const [audience, setAudience] = useState("studios");
  const [channel, setChannel] = useState("linkedin");
  const [tone, setTone] = useState<Tone>("direct");
  const [style, setStyle] = useState<Style>("mono");
  const [device, setDevice] = useState<Device>("desktop");
  const [variant, setVariant] = useState<0 | 1>(0);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ kind: "ready" | "loading" | "done" | "error" | "info"; text: string }>({ kind: "ready", text: "Ready" });
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activity, setActivity] = useState<Activity[]>(() => {
    const t = Date.now();
    return [
      { id: 2, kind: "select", text: "Concept B selected", at: t - 3 * 60_000 },
      { id: 1, kind: "control", text: "Campaign created · Orbit launch", at: t - 18 * 60_000 },
    ];
  });

  const timers = useRef<Set<number>>(new Set());
  const generateCount = useRef(0);
  const nextId = useRef(3);
  const actions = useRef<{ generate: () => void; save: () => void; export: () => void; select: (id: ConceptId) => void } | null>(null);

  useEffect(() => {
    const set = timers.current;
    return () => {
      set.forEach((t) => window.clearTimeout(t));
      set.clear();
    };
  }, []);

  const schedule = (fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timers.current.delete(id);
      fn();
    }, ms);
    timers.current.add(id);
  };

  const current = CONCEPTS.find((c) => c.id === concept)!;
  const audienceLabel = AUDIENCES.find((a) => a.value === audience)!.label;
  const ch = CHANNELS.find((c) => c.value === channel)!;
  const st = STYLES.find((s) => s.id === style)!;
  const briefValid = brief.trim().length >= BRIEF_MIN;
  const briefError = briefValid ? null : `Add at least ${BRIEF_MIN} characters so Muse has something to work from.`;

  const forecast = useMemo(() => {
    const toneMod = { direct: [1, 1.05, 1.04], warm: [1.02, 1, 1.02], witty: [1.06, 1.08, 0.96] }[tone];
    const reach = current.base.reach * ch.reach * toneMod[0];
    const ctr = current.base.ctr * ch.ctr * toneMod[1];
    const conv = current.base.conv * ch.conv * toneMod[2];
    return [
      { label: "Reach", value: `${(reach / 1000).toFixed(1)}K`, pct: Math.min(100, (reach / 80000) * 100), help: "Unique accounts expected to see the creative in the first 14 days." },
      { label: "CTR", value: `${ctr.toFixed(2)}%`, pct: Math.min(100, (ctr / 5) * 100), help: "Clicks divided by impressions, weighted by channel benchmarks." },
      { label: "Conversion", value: `${conv.toFixed(2)}%`, pct: Math.min(100, (conv / 5) * 100), help: "Trial sign-ups per landing page visit for this audience." },
    ];
  }, [current, ch, tone]);

  /* ------------------------------ actions ------------------------------- */

  const log = (kind: ActivityKind, text: string) => {
    setActivity((a) => [{ id: nextId.current++, kind, text, at: stamp() }, ...a].slice(0, 7));
  };

  const pushHistory = (label: string) => {
    setHistory((h) => [{ label, snapshot: { concept, audience, channel, tone, style } }, ...h].slice(0, 10));
  };

  const selectConcept = (id: ConceptId) => {
    if (id === concept) return;
    pushHistory(`Concept ${concept} → ${id}`);
    setConcept(id);
    log("select", `Concept ${id} · ${CONCEPTS.find((c) => c.id === id)!.name}`);
  };

  const changeControl = <T extends string>(setter: (v: T) => void, label: string, value: T, display: string) => {
    pushHistory(`${label} changed`);
    setter(value);
    log("control", `${label} → ${display}`);
  };

  // Error rule: Generate is disabled while the brief is under 20 characters
  // (reason shown in a tooltip). Every 4th successful click fails after the
  // loading window to exercise the error path.
  const generate = () => {
    if (loading || !briefValid) return;
    setExportOpen(false);
    setLoading(true);
    generateCount.current += 1;
    const willFail = generateCount.current % 4 === 0;
    setStatus({ kind: "loading", text: `Generating concept ${concept}…` });
    log("generate", `Generating concept ${concept}`);
    const started = stamp();
    schedule(() => {
      setLoading(false);
      const secs = ((stamp() - started) / 1000).toFixed(1);
      if (willFail) {
        setStatus({ kind: "error", text: "Generation failed · the model returned an empty response." });
        log("generate", `Concept ${concept} failed`);
        return;
      }
      setVariant((v) => (v === 0 ? 1 : 0));
      setStatus({ kind: "done", text: `Generated · ${secs}s` });
      log("generate", `Concept ${concept} regenerated`);
    }, 1300);
  };

  const save = () => {
    setSaved(true);
    setStatus({ kind: "info", text: `Draft saved · ${hhmm(stamp())}` });
    log("save", "Draft saved");
    schedule(() => setSaved(false), 2000);
  };

  const exportAs = (kind: "PNG" | "PDF") => {
    setStatus({ kind: "info", text: `Exported ${kind} · ${current.name}` });
    log("export", `Exported ${kind}`);
  };

  const shareLink = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const done = () => {
      setCopied(true);
      setStatus({ kind: "info", text: "Share link copied to clipboard" });
      log("export", "Share link copied");
      schedule(() => setCopied(false), 2000);
    };
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, done);
    else done();
  };

  const undo = () => {
    const [last, ...rest] = history;
    if (!last) return;
    setHistory(rest);
    setConcept(last.snapshot.concept);
    setAudience(last.snapshot.audience);
    setChannel(last.snapshot.channel);
    setTone(last.snapshot.tone);
    setStyle(last.snapshot.style);
    setStatus({ kind: "info", text: `Undid: ${last.label}` });
    log("control", `Undo · ${last.label}`);
  };

  useEffect(() => {
    actions.current = { generate, save, export: () => setExportOpen(true), select: selectConcept };
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target as HTMLElement | null;
      if (el && (el.closest("input, textarea, select, [contenteditable=true], [role=combobox], [role=menu], [role=dialog]") || el.isContentEditable)) return;
      const a = actions.current;
      if (!a) return;
      const k = e.key.toLowerCase();
      if (k === "g") a.generate();
      else if (k === "s") a.save();
      else if (k === "e") a.export();
      else if (k === "1" || k === "2" || k === "3") a.select((["A", "B", "C"] as ConceptId[])[Number(k) - 1]);
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ------------------------------- render ------------------------------- */

  const headline = current.headlines[variant];
  const isDeep = style === "deep";

  const generateButton = (
    <Button onClick={generate} disabled={loading || !briefValid} aria-busy={loading} className="w-full lg:w-auto">
      {loading ? <Loader2 className="animate-spin motion-reduce:animate-none" aria-hidden /> : <Sparkles aria-hidden />}
      {loading ? "Generating…" : "Generate concept"}
    </Button>
  );

  const generateWithReason = briefValid ? (
    generateButton
  ) : (
    <Tooltip>
      <TooltipTrigger render={<span className="inline-flex w-full lg:w-auto" tabIndex={0} aria-label="Generate is disabled" />}>{generateButton}</TooltipTrigger>
      <TooltipContent>{briefError}</TooltipContent>
    </Tooltip>
  );

  const exportMenu = (
    <DropdownMenu open={exportOpen} onOpenChange={setExportOpen}>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        {copied ? <Check aria-hidden /> : <Download aria-hidden />}
        {copied ? "Copied" : "Export"}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44">
        <DropdownMenuItem onClick={() => exportAs("PNG")}><FileImage aria-hidden /> Export as PNG</DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportAs("PDF")}><FileText aria-hidden /> Export as PDF</DropdownMenuItem>
        <DropdownMenuItem onClick={shareLink}><Link2 aria-hidden /> Copy share link</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const saveButton = (
    <Button variant="outline" onClick={save} aria-live="polite">
      {saved ? <Check aria-hidden /> : <Save aria-hidden />}
      {saved ? "Saved" : "Save draft"}
    </Button>
  );

  return (
    <TooltipProvider>
      <div className="min-h-dvh bg-background text-foreground">
        {/* Toolbar */}
        <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
          <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5 lg:px-6">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <span className="text-base font-semibold tracking-tight">Muse</span>
              <span className="text-sm text-muted-foreground">Product Polish Chain</span>
              <Badge variant="secondary">Fable 5.1</Badge>
              <Badge variant="outline" className="max-w-[260px] truncate sm:max-w-none" title="frontend-app-builder + shadcn-best-practices + web-interface-guidelines + impeccable">
                frontend-app-builder + shadcn-best-practices + web-interface-guidelines + impeccable
              </Badge>
            </div>
            <div className="hidden w-full justify-center md:flex lg:w-auto lg:flex-1">
              <Tabs value={device} onValueChange={(v) => setDevice(v as Device)}>
                <TabsList aria-label="Preview device">
                  <TabsTrigger value="desktop">Desktop</TabsTrigger>
                  <TabsTrigger value="tablet">Tablet</TabsTrigger>
                  <TabsTrigger value="mobile">Mobile</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            {/* Actions: bottom bar on small screens, toolbar slot on desktop */}
            <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-[1fr_1fr_1.6fr] gap-2 border-t border-border bg-background/95 p-3 backdrop-blur [&_button]:h-11 lg:static lg:ml-auto lg:flex lg:items-center lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none lg:[&_button]:h-8">
              <Sheet>
                <SheetTrigger render={<Button variant="ghost" size="icon" aria-label="Keyboard shortcuts" className="hidden lg:inline-flex" />}>
                  <Keyboard aria-hidden />
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Keyboard shortcuts</SheetTitle>
                    <SheetDescription>Shortcuts are ignored while you type in a field.</SheetDescription>
                  </SheetHeader>
                  <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 px-4 text-sm">
                    {[["G", "Generate concept"], ["S", "Save draft"], ["E", "Open export menu"], ["1 / 2 / 3", "Select concept A / B / C"]].map(([k, v]) => (
                      <div key={k} className="contents">
                        <dt><kbd className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">{k}</kbd></dt>
                        <dd className="text-muted-foreground">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </SheetContent>
              </Sheet>
              {saveButton}
              {exportMenu}
              {generateWithReason}
            </div>
          </div>
          {/* Status line: fixed height so nothing shifts */}
          <div className="border-t border-border bg-muted/40">
            <p
              role="status"
              aria-live="polite"
              className={cn("mx-auto flex h-8 max-w-[1440px] items-center gap-2 px-4 text-xs lg:px-6", status.kind === "error" ? "text-destructive" : "text-muted-foreground")}
            >
              {status.kind === "loading" && <Loader2 className="size-3 animate-spin motion-reduce:animate-none" aria-hidden />}
              {status.kind === "done" && <Check className="size-3 text-primary" aria-hidden />}
              <span className="truncate">{status.text}</span>
              {status.kind === "error" && (
                <Button variant="link" size="xs" onClick={generate} className="h-auto p-0 text-xs">Retry</Button>
              )}
            </p>
          </div>
        </header>

        {/* Body */}
        <main className="mx-auto grid max-w-[1440px] gap-6 px-4 py-6 pb-28 lg:grid-cols-[320px_1fr_300px] lg:px-6 lg:pb-8">
          {/* Setup */}
          <Card className="order-2 lg:order-1 lg:self-start">
            <CardHeader>
              <CardTitle>Campaign setup</CardTitle>
              <CardDescription>Everything here updates the preview and forecast.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between">
                  <label htmlFor="pp-brief" className="text-sm font-medium">Campaign brief</label>
                  <span className="text-xs tabular-nums text-muted-foreground" aria-hidden>{brief.length} / {BRIEF_MAX}</span>
                </div>
                <Textarea
                  id="pp-brief"
                  value={brief}
                  maxLength={BRIEF_MAX}
                  rows={5}
                  aria-invalid={!briefValid}
                  aria-describedby="pp-brief-desc pp-brief-error"
                  onChange={(e) => setBrief(e.target.value)}
                  onBlur={() => log("control", "Brief edited")}
                  className="min-h-28 resize-none"
                />
                <p id="pp-brief-desc" className="text-xs text-muted-foreground">Product, who it is for, and the single outcome you want. {brief.length} of {BRIEF_MAX} characters.</p>
                <p id="pp-brief-error" className={cn("min-h-4 text-xs text-destructive", !briefError && "invisible")}>{briefError ?? "Brief looks good."}</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="pp-audience" className="text-sm font-medium">Audience</label>
                <Select items={AUDIENCES} value={audience} onValueChange={(v) => v && changeControl(setAudience, "Audience", String(v), AUDIENCES.find((a) => a.value === v)!.label)}>
                  <SelectTrigger id="pp-audience" className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {AUDIENCES.map((a) => <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="pp-channel" className="text-sm font-medium">Channel</label>
                <Select items={CHANNELS} value={channel} onValueChange={(v) => v && changeControl(setChannel, "Channel", String(v), CHANNELS.find((c) => c.value === v)!.label)}>
                  <SelectTrigger id="pp-channel" className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CHANNELS.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <span id="pp-tone-label" className="text-sm font-medium">Tone</span>
                <Tabs value={tone} onValueChange={(v) => changeControl(setTone, "Tone", v as Tone, TONES.find((t) => t.id === v)!.label)}>
                  <TabsList variant="line" aria-labelledby="pp-tone-label" className="w-full">
                    {TONES.map((t) => <TabsTrigger key={t.id} value={t.id}>{t.label}</TabsTrigger>)}
                  </TabsList>
                </Tabs>
              </div>

              <div className="flex flex-col gap-1.5">
                <span id="pp-style-label" className="text-sm font-medium">Visual style</span>
                <div role="radiogroup" aria-labelledby="pp-style-label" className="grid grid-cols-4 gap-2">
                  {STYLES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      role="radio"
                      aria-checked={style === s.id}
                      aria-label={s.label}
                      onClick={() => changeControl(setStyle, "Visual style", s.id, s.label)}
                      className={cn(
                        "flex min-h-11 flex-col items-center gap-1 rounded-lg border p-1.5 text-xs transition-colors outline-none hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                        style === s.id ? "border-primary bg-muted" : "border-border",
                      )}
                    >
                      <span className="h-5 w-full rounded-md border border-foreground/10" style={{ background: `linear-gradient(135deg, ${s.bg} 55%, ${s.ink} 55%)` }} aria-hidden />
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <section aria-labelledby="pp-preview" className="order-1 flex min-w-0 flex-col gap-4 lg:order-2">
            <h2 id="pp-preview" className="sr-only">Creative preview</h2>
            <div className="flex flex-wrap items-center gap-3">
              <div role="group" aria-label="Creative concept" className="flex gap-2">
                {CONCEPTS.map((c) => (
                  <Button key={c.id} variant={c.id === concept ? "default" : "outline"} aria-pressed={c.id === concept} onClick={() => selectConcept(c.id)} className="min-h-9 gap-2 lg:min-h-8">
                    <span className="size-2 rounded-full" style={{ background: c.accent }} aria-hidden />
                    {c.id} · {c.name}
                  </Button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">Concept {current.id} · {audienceLabel} · {ch.label}</p>
            </div>

            <div className="rounded-xl border border-border bg-muted/40 p-3 sm:p-5">
              <div
                className="mx-auto w-full overflow-hidden rounded-lg border border-border shadow-sm transition-[max-width] duration-300 motion-reduce:transition-none"
                style={{ maxWidth: FRAME[device], background: st.bg, color: st.ink }}
              >
                {/* nav */}
                <div className="flex items-center justify-between border-b px-5 py-3 text-xs" style={{ borderColor: isDeep ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" }}>
                  <span className="flex items-center gap-2 font-semibold">
                    <span className="size-2.5 rounded-full" style={{ background: current.accent }} aria-hidden />
                    Orbit
                  </span>
                  <span className={cn("gap-4 opacity-70", device === "mobile" ? "hidden" : "hidden sm:flex")}><span>Product</span><span>Studios</span><span>Pricing</span></span>
                  <span className="opacity-70">Sign in</span>
                </div>

                <div className={cn("grid gap-6 p-5 sm:p-8", device === "desktop" && "md:grid-cols-[1.1fr_1fr] md:items-center")}>
                  <div className="flex flex-col gap-4" aria-busy={loading}>
                    {loading ? (
                      <>
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-9 w-full" />
                        <Skeleton className="h-9 w-4/5" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-11/12" />
                        <Skeleton className="mt-1 h-9 w-40" />
                      </>
                    ) : (
                      <>
                        <span className="text-xs font-medium uppercase tracking-wider" style={{ color: current.accent }}>{current.angle} · for {audienceLabel.toLowerCase()}</span>
                        <h3 className="text-[clamp(1.6rem,3.2vw,2.5rem)] font-semibold leading-[1.05] tracking-tight">{headline}</h3>
                        <p className="max-w-prose text-sm leading-relaxed opacity-80">{SUB[tone]}</p>
                        <div className="flex flex-wrap items-center gap-3 pt-1">
                          <span className={cn(buttonVariants({ size: "lg" }), "pointer-events-none text-white")} style={{ background: current.accent }}>{CTA[tone]}</span>
                          <span className="text-xs opacity-60">Free for 3 projects · no card</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* kanban */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3" aria-hidden>
                    {current.columns.map((count, col) => (
                      <div key={col} className="flex flex-col gap-2 rounded-lg p-2" style={{ background: isDeep ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.035)" }}>
                        <div className="flex items-center justify-between px-1 text-[10px] font-medium opacity-60">
                          <span>{["Backlog", "In progress", "Shipped"][col]}</span>
                          <span>{count}</span>
                        </div>
                        {Array.from({ length: count }).map((_, i) => (
                          <div key={i} className="rounded-md p-2" style={{ background: st.card, boxShadow: isDeep ? "none" : "0 1px 2px rgba(0,0,0,0.06)" }}>
                            <div className="mb-1.5 h-1.5 w-8 rounded-full" style={{ background: current.accent, opacity: 0.4 + i * 0.25 }} />
                            <div className="h-1.5 w-full rounded-full" style={{ background: st.ink, opacity: 0.18 }} />
                            <div className="mt-1 h-1.5 w-2/3 rounded-full" style={{ background: st.ink, opacity: 0.12 }} />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Forecast + activity */}
          <div className="order-3 flex flex-col gap-4 lg:self-start">
            <Card>
              <CardHeader>
                <CardTitle>Forecast</CardTitle>
                <CardDescription>Concept {current.id} on {ch.label}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {forecast.map((row) => (
                  <div key={row.label} className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{row.label}</span>
                      <Tooltip>
                        <TooltipTrigger render={<button type="button" className="inline-flex size-6 items-center justify-center rounded-md text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50" aria-label={`About ${row.label}`} />}>
                          <Info className="size-3.5" aria-hidden />
                        </TooltipTrigger>
                        <TooltipContent>{row.help}</TooltipContent>
                      </Tooltip>
                      <span className="ml-auto text-sm font-semibold tabular-nums">{row.value}</span>
                    </div>
                    <Progress value={row.pct} aria-label={`${row.label} relative to channel ceiling`} />
                  </div>
                ))}
                <Separator />
                <p className="text-xs text-muted-foreground">{ch.label} weight · reach ×{ch.reach} · CTR ×{ch.ctr} · conversion ×{ch.conv}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activity</CardTitle>
                <CardDescription>Latest actions on this campaign</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <ul className="flex flex-col gap-2.5">
                  {activity.map((a) => {
                    const Icon = ACTIVITY_ICON[a.kind];
                    return (
                      <li key={a.id} className="flex items-start gap-2.5 text-sm">
                        <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
                        <span className="flex-1 leading-snug">{a.text}</span>
                        <time className="text-xs tabular-nums text-muted-foreground" suppressHydrationWarning>{hhmm(a.at)}</time>
                      </li>
                    );
                  })}
                </ul>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={undo}
                  disabled={history.length === 0}
                  title={history.length === 0 ? "Nothing to undo yet" : `Undo: ${history[0].label}`}
                  className="self-start"
                >
                  <Undo2 aria-hidden /> {history.length === 0 ? "Nothing to undo" : `Undo last (${history[0].label})`}
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
