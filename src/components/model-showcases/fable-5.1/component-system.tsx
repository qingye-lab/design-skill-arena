"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Check,
  ChevronDown,
  Download,
  Info,
  Loader2,
  Save,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/* ---------------------------------- data ---------------------------------- */

type ConceptId = "A" | "B" | "C";
type Option<T extends string> = { value: T; label: string };

const AUDIENCES = [
  { value: "runners", label: "Runners 25–40" },
  { value: "trail", label: "Trail beginners" },
  { value: "marathon", label: "Marathon trainers" },
  { value: "eco", label: "Eco-conscious commuters" },
] as const;
const CHANNELS = [
  { value: "reels", label: "Instagram Reels", mult: 1.0, ctr: 1.0 },
  { value: "youtube", label: "YouTube pre-roll", mult: 1.35, ctr: 0.7 },
  { value: "ooh", label: "Out-of-home", mult: 2.1, ctr: 0.25 },
  { value: "email", label: "Email", mult: 0.3, ctr: 2.2 },
] as const;
const TONES = [
  { value: "energetic", label: "Energetic", cta: "Lace up" },
  { value: "calm", label: "Calm", cta: "Take the first step" },
  { value: "bold", label: "Bold", cta: "Outrun ordinary" },
  { value: "playful", label: "Playful", cta: "Bounce in" },
] as const;
const STYLES = [
  { value: "contrast", label: "High contrast" },
  { value: "minimal", label: "Minimal" },
  { value: "editorial", label: "Editorial" },
  { value: "retro", label: "Retro" },
] as const;

type Audience = (typeof AUDIENCES)[number]["value"];
type Channel = (typeof CHANNELS)[number]["value"];
type Tone = (typeof TONES)[number]["value"];
type Style = (typeof STYLES)[number]["value"];

const CONCEPTS: Record<
  ConceptId,
  {
    name: string;
    headline: string;
    sub: string;
    gradient: string;
    reach: number;
    ctr: number;
    conv: number;
  }
> = {
  A: {
    name: "Lighter footprint",
    headline: "Run light. Leave less.",
    sub: "Stride's recycled-foam midsole gives the same bounce with 40% less waste.",
    gradient: "linear-gradient(135deg, #f97316 0%, #ef4444 60%, #7c2d12 100%)",
    reach: 1_240_000,
    ctr: 2.4,
    conv: 1.6,
  },
  B: {
    name: "Bounce back",
    headline: "Every stride gives back.",
    sub: "Foam made from yesterday's shoes. Energy return built for today's miles.",
    gradient: "linear-gradient(135deg, #0ea5e9 0%, #14b8a6 55%, #a3e635 100%)",
    reach: 980_000,
    ctr: 3.1,
    conv: 2.2,
  },
  C: {
    name: "Made to go far",
    headline: "Miles ahead. Grounded.",
    sub: "A long-distance trainer that doesn't cost the ground it runs on.",
    gradient: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 55%, #db2777 100%)",
    reach: 1_510_000,
    ctr: 1.9,
    conv: 1.3,
  },
};

type LogEntry = { id: number; time: string; action: string; detail: string };

const INITIAL_LOG: LogEntry[] = [
  { id: 3, time: "09:14", action: "Generate", detail: "Concept A · Runners 25–40" },
  { id: 2, time: "09:11", action: "Control", detail: "Channel → Instagram Reels" },
  { id: 1, time: "09:02", action: "Brief", detail: "Draft created" },
];

const fmtReach = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(2)}M` : `${Math.round(n / 1000)}K`;
const nowLabel = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

/* ----------------------------- small composites ---------------------------- */

function LabeledSelect<T extends string>({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: T;
  options: ReadonlyArray<Option<T>>;
  onChange: (value: T) => void;
}) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <Select
        value={value}
        items={options}
        onValueChange={(next) => {
          if (next) onChange(next);
        }}
      >
        <SelectTrigger id={id} className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function ShoeSilhouette({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 110" aria-hidden="true" className={className}>
      <path
        d="M8 78 C 30 40, 70 34, 100 42 C 125 48, 140 26, 165 18 C 180 13, 190 22, 200 40 C 208 55, 222 64, 232 72 L 232 84 C 160 96, 70 98, 8 90 Z"
        fill="currentColor"
      />
      <path
        d="M8 90 C 70 98, 160 96, 232 84 L 232 92 C 160 104, 70 106, 8 98 Z"
        fill="currentColor"
        opacity="0.45"
      />
    </svg>
  );
}

function MetricCard({
  label,
  hint,
  value,
  max,
  display,
}: {
  label: string;
  hint: string;
  value: number;
  max: number;
  display: string;
}) {
  return (
    <Card size="sm">
      <CardContent>
        <Progress value={value} max={max} aria-label={label}>
          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-sm text-sm font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              }
            >
              <ProgressLabel render={<span />}>{label}</ProgressLabel>
              <Info className="size-3.5 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>{hint}</TooltipContent>
          </Tooltip>
          <ProgressValue>{() => display}</ProgressValue>
        </Progress>
      </CardContent>
    </Card>
  );
}

/* ---------------------------------- page ---------------------------------- */

export default function ComponentSystem() {
  const [brief, setBrief] = useState(
    "Launch Stride, our first running shoe with a recycled-foam midsole. Lead with performance, prove the sustainability.",
  );
  const [campaign, setCampaign] = useState("Stride — Spring launch");
  const [audience, setAudience] = useState<Audience>("runners");
  const [channel, setChannel] = useState<Channel>("reels");
  const [tone, setTone] = useState<Tone>("energetic");
  const [style, setStyle] = useState<Style>("contrast");
  const [concept, setConcept] = useState<ConceptId>("A");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [log, setLog] = useState<LogEntry[]>(INITIAL_LOG);
  const [lastSaved, setLastSaved] = useState("09:14");
  const attempts = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const pushLog = (action: string, detail: string) =>
    setLog((prev) => [{ id: Date.now(), time: nowLabel(), action, detail }, ...prev]);

  const audienceLabel = AUDIENCES.find((a) => a.value === audience)!.label;
  const channelMeta = CHANNELS.find((c) => c.value === channel)!;
  const toneMeta = TONES.find((t) => t.value === tone)!;
  const styleLabel = STYLES.find((s) => s.value === style)!.label;
  const controlLine = `${audienceLabel} · ${channelMeta.label} · ${toneMeta.label} · ${styleLabel}`;

  const active = CONCEPTS[concept];
  const toneFactor = tone === "bold" ? 1.08 : tone === "calm" ? 0.94 : 1;
  const reach = Math.round(active.reach * channelMeta.mult);
  const ctr = active.ctr * channelMeta.ctr * toneFactor;
  const conv = active.conv * toneFactor * (style === "minimal" ? 1.05 : 1);

  const changeControl =
    <T extends string>(setter: (v: T) => void, name: string, options: ReadonlyArray<Option<T>>) =>
    (v: T) => {
      setter(v);
      pushLog("Control", `${name} → ${options.find((o) => o.value === v)?.label ?? v}`);
    };

  const selectConcept = (id: ConceptId) => {
    if (id === concept) return;
    setConcept(id);
    pushLog("Concept", `Switched to ${id} · ${CONCEPTS[id].name}`);
  };

  // Error rule: a brief under 20 characters always fails validation; otherwise
  // every 4th generate attempt fails with a simulated model error.
  const generate = () => {
    if (status === "loading") return;
    attempts.current += 1;
    const attempt = attempts.current;
    setStatus("loading");
    setErrorMessage("");
    pushLog("Generate", `Concept ${concept} · ${channelMeta.label}`);
    timer.current = setTimeout(() => {
      if (brief.trim().length < 20) {
        setStatus("error");
        setErrorMessage("The brief is too short to generate from. Add at least 20 characters.");
        pushLog("Error", "Brief too short");
        return;
      }
      if (attempt % 4 === 0) {
        setStatus("error");
        setErrorMessage("The concept model timed out. Your brief and controls are intact — try again.");
        pushLog("Error", "Model timed out");
        return;
      }
      setStatus("success");
      setDialogOpen(true);
      pushLog("Ready", `Concept ${concept} rendered for ${channelMeta.label}`);
    }, 1500);
  };

  const save = () => {
    const t = nowLabel();
    setLastSaved(t);
    pushLog("Save", `${campaign || "Untitled campaign"} saved`);
  };

  const exportAs = (format: string) => pushLog("Export", `Concept ${concept} · ${format}`);

  const loading = status === "loading";
  const statusText =
    status === "loading"
      ? "Generating concept…"
      : status === "success"
        ? "Concept ready."
        : status === "error"
          ? errorMessage
          : "";

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-7xl px-4 py-6">
          {/* Header */}
          <header className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3">
              <div
                aria-hidden="true"
                className="flex size-9 items-center justify-center rounded-lg bg-primary font-heading text-base font-semibold text-primary-foreground"
              >
                M
              </div>
              <div className="leading-tight">
                <h1 className="font-heading text-base font-semibold">
                  Muse{" "}
                  <span className="font-normal text-muted-foreground">/ Component System</span>
                </h1>
                <p className="text-xs text-muted-foreground">AI Campaign Studio</p>
              </div>
            </div>
            <Separator orientation="vertical" className="hidden h-6 sm:block" />
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">Fable 5.1</Badge>
              <Badge variant="outline">shadcn-best-practices / shadcn</Badge>
            </div>
            <div className="ml-auto flex flex-wrap items-center gap-2">
              <Button type="button" variant="outline" onClick={save}>
                <Save data-icon="inline-start" />
                Save
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button type="button" variant="outline" />}>
                  <Download data-icon="inline-start" />
                  Export
                  <ChevronDown data-icon="inline-end" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => exportAs("PNG")}>PNG</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportAs("PDF")}>PDF</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportAs("JSON")}>JSON</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button type="button" onClick={generate} disabled={loading} aria-busy={loading}>
                {loading ? (
                  <Loader2 data-icon="inline-start" className="animate-spin" />
                ) : (
                  <Sparkles data-icon="inline-start" />
                )}
                {loading ? "Generating…" : "Generate"}
              </Button>
            </div>
          </header>

          <p aria-live="polite" className="sr-only">
            {statusText}
          </p>

          <div className="mt-6 grid gap-6 lg:grid-cols-[360px_1fr]">
            {/* Left: brief */}
            <div className="grid content-start gap-4">
              {status === "error" && (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
                >
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                  <div className="grid flex-1 gap-2">
                    <p className="font-medium">Generation failed</p>
                    <p>{errorMessage}</p>
                    <div>
                      <Button type="button" variant="destructive" size="sm" onClick={generate}>
                        Retry
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Campaign brief</CardTitle>
                  <CardDescription>
                    Describe the launch. Controls below steer copy, format and forecast.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid gap-1.5">
                    <label htmlFor="cs-brief" className="text-sm font-medium">
                      Brief
                    </label>
                    <Textarea
                      id="cs-brief"
                      value={brief}
                      onChange={(e) => setBrief(e.target.value)}
                      aria-invalid={status === "error" && brief.trim().length < 20}
                      className="min-h-28"
                      placeholder="What are we launching, for whom, and why now?"
                    />
                    <p className="text-xs text-muted-foreground">
                      {brief.trim().length} characters · minimum 20
                    </p>
                  </div>
                  <div className="grid gap-1.5">
                    <label htmlFor="cs-campaign" className="text-sm font-medium">
                      Campaign name
                    </label>
                    <Input
                      id="cs-campaign"
                      value={campaign}
                      onChange={(e) => setCampaign(e.target.value)}
                      placeholder="Stride — Spring launch"
                    />
                  </div>
                  <Separator />
                  <LabeledSelect
                    id="cs-audience"
                    label="Audience"
                    value={audience}
                    options={AUDIENCES}
                    onChange={changeControl(setAudience, "Audience", AUDIENCES)}
                  />
                  <LabeledSelect
                    id="cs-channel"
                    label="Channel"
                    value={channel}
                    options={CHANNELS}
                    onChange={changeControl(setChannel, "Channel", CHANNELS)}
                  />
                  <LabeledSelect
                    id="cs-tone"
                    label="Tone"
                    value={tone}
                    options={TONES}
                    onChange={changeControl(setTone, "Tone", TONES)}
                  />
                  <LabeledSelect
                    id="cs-style"
                    label="Visual style"
                    value={style}
                    options={STYLES}
                    onChange={changeControl(setStyle, "Visual style", STYLES)}
                  />
                </CardContent>
                <CardFooter>
                  <p className="text-xs text-muted-foreground">Last saved {lastSaved}</p>
                </CardFooter>
              </Card>
            </div>

            {/* Right: concepts, metrics, activity */}
            <div className="grid min-w-0 content-start gap-6">
              <Tabs value={concept} onValueChange={(v) => selectConcept(v as ConceptId)}>
                <div className="overflow-x-auto">
                  <TabsList aria-label="Creative concepts">
                    {(Object.keys(CONCEPTS) as ConceptId[]).map((id) => (
                      <TabsTrigger key={id} value={id} className="px-3">
                        Concept {id}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
                {(Object.keys(CONCEPTS) as ConceptId[]).map((id) => {
                  const c = CONCEPTS[id];
                  return (
                    <TabsContent key={id} value={id}>
                      <Card>
                        <CardHeader>
                          <CardTitle>
                            {c.name}
                            <span className="ml-2 font-normal text-muted-foreground">
                              Concept {id}
                            </span>
                          </CardTitle>
                          <CardDescription>
                            {channelMeta.label} · {campaign || "Untitled campaign"}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-3">
                          {loading ? (
                            <div className="grid aspect-video gap-4 rounded-lg bg-muted/40 p-6 sm:p-10">
                              <Skeleton className="h-4 w-24" />
                              <Skeleton className="h-10 w-3/4 sm:h-14" />
                              <Skeleton className="h-4 w-2/3" />
                              <Skeleton className="mt-auto h-8 w-28" />
                            </div>
                          ) : (
                            <div
                              className="relative aspect-video overflow-hidden rounded-lg text-white"
                              style={{ backgroundImage: c.gradient }}
                            >
                              <ShoeSilhouette className="absolute -right-6 bottom-0 w-[62%] text-white/25 sm:w-[55%]" />
                              <div className="relative flex h-full flex-col p-5 sm:p-8">
                                <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-white/80">
                                  <span>Stride</span>
                                  <span aria-hidden="true">·</span>
                                  <span>{channelMeta.label}</span>
                                </div>
                                <h2
                                  className={cn(
                                    "mt-auto max-w-[70%] font-heading text-2xl font-semibold leading-[1.05] sm:text-4xl lg:text-5xl",
                                    style === "editorial" && "font-normal italic tracking-tight",
                                    style === "contrast" && "uppercase tracking-tight",
                                    style === "retro" && "tracking-wide",
                                  )}
                                >
                                  {c.headline}
                                </h2>
                                <p className="mt-2 max-w-[60%] text-xs text-white/85 sm:text-sm">
                                  {c.sub}
                                </p>
                                <div className="mt-4 flex items-center gap-3">
                                  <span
                                    className={cn(
                                      buttonVariants({ variant: "secondary", size: "sm" }),
                                      "pointer-events-none",
                                    )}
                                  >
                                    {toneMeta.cta}
                                  </span>
                                  <span className="text-[11px] text-white/70">{audienceLabel}</span>
                                </div>
                              </div>
                            </div>
                          )}
                          <CardDescription>{controlLine}</CardDescription>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  );
                })}
              </Tabs>

              <div className="grid gap-4 sm:grid-cols-3">
                <MetricCard
                  label="Reach"
                  hint="Estimated unique people who see the creative during the flight."
                  value={reach}
                  max={3_500_000}
                  display={fmtReach(reach)}
                />
                <MetricCard
                  label="CTR"
                  hint="Clicks divided by impressions, forecast from channel benchmarks."
                  value={ctr}
                  max={8}
                  display={`${ctr.toFixed(2)}%`}
                />
                <MetricCard
                  label="Conversion"
                  hint="Share of clicks expected to complete a purchase."
                  value={conv}
                  max={4}
                  display={`${conv.toFixed(2)}%`}
                />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Activity</CardTitle>
                  <CardDescription>Every change to this campaign, newest first.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-56 rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-20">Time</TableHead>
                          <TableHead className="w-28">Action</TableHead>
                          <TableHead>Detail</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {log.map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell className="text-muted-foreground tabular-nums">
                              {entry.time}
                            </TableCell>
                            <TableCell className="font-medium">{entry.action}</TableCell>
                            <TableCell className="text-muted-foreground">{entry.detail}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Check className="size-4" />
                Concept ready
              </DialogTitle>
              <DialogDescription>
                Concept {concept} · {active.name} was rendered for {channelMeta.label}, aimed at{" "}
                {audienceLabel.toLowerCase()} in a {toneMeta.label.toLowerCase()} tone. Forecast:{" "}
                {fmtReach(reach)} reach, {ctr.toFixed(2)}% CTR, {conv.toFixed(2)}% conversion.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button type="button" />}>Done</DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
