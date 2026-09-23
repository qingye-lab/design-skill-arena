"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDownToLine, Bookmark, Check, CircleAlert, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import styles from "./studio.module.css";
import { showcaseDetails, showcaseIds, type ShowcaseId } from "./metadata";

type Variant = "A" | "B" | "C";
type Status = "idle" | "loading" | "success" | "error";
type CampaignSnapshot = { brief: string; audience: string; channel: string; tone: string; visualStyle: string; variant: Variant; revision: number };
type Campaign = CampaignSnapshot & { title: string; when: string };
const storageKey = "muse-gpt-6-sol-campaigns";
const defaultBrief = "Launch Luma One, a portable light that makes any space feel like yours. Lead with freedom, warmth, and an understated design story.";
const defaultCampaign: CampaignSnapshot = { brief: defaultBrief, audience: "Design-minded movers", channel: "Social", tone: "Confident", visualStyle: "Editorial", variant: "A", revision: 1 };

const campaigns: Campaign[] = [
  { ...defaultCampaign, title: "Luma One · launch", when: "Today" },
  { ...defaultCampaign, title: "After hours · teaser", channel: "Email", variant: "C", when: "Yesterday" },
  { ...defaultCampaign, title: "Light, wherever · reveal", channel: "Web", variant: "B", when: "Sep 18" },
];

function isCampaign(item: unknown): item is Campaign {
  if (typeof item !== "object" || item === null) return false;
  const value = item as Record<string, unknown>;
  return ["title", "when", "brief", "audience", "channel", "tone", "visualStyle"].every((key) => typeof value[key] === "string")
    && (value.variant === "A" || value.variant === "B" || value.variant === "C")
    && typeof value.revision === "number" && Number.isFinite(value.revision) && value.revision >= 1;
}

const variants: Record<Variant, { title: string; line: string; description: string; reach: number; ctr: number; conversion: number }> = {
  A: { title: "Make room for light.", line: "The everyday, illuminated.", description: "A quieter kind of brightness, wherever the day takes you.", reach: 82, ctr: 4.8, conversion: 2.1 },
  B: { title: "Take the glow with you.", line: "Light moves with life.", description: "From your desk to the last table of the night.", reach: 91, ctr: 5.3, conversion: 2.5 },
  C: { title: "Own the after hours.", line: "Everywhere feels like yours.", description: "One small light. A thousand places to stay a little longer.", reach: 76, ctr: 6.1, conversion: 2.8 },
};

const headlines: Record<string, Record<Variant, string>> = {
  Confident: { A: "Make room for light.", B: "Take the glow with you.", C: "Own the after hours." },
  Warm: { A: "A little light, wherever you are.", B: "Feel at home anywhere.", C: "Stay for one more moment." },
  Playful: { A: "Hello, brighter days.", B: "Glow wherever you go.", C: "Night plans? Light plans." },
  Minimal: { A: "Light, made yours.", B: "Move with light.", C: "After dark, refined." },
};

function resolveCreative(direction: Variant, tone: string, revision: number, brief: string) {
  return {
    ...variants[direction],
    headline: (headlines[tone] ?? headlines.Confident)[direction],
    body: revision > 1 ? brief.trim().split(/[.!?]/)[0].slice(0, 95) : variants[direction].description,
  };
}

export function useStudio() {
  const [brief, setBrief] = useState(defaultBrief);
  const [audience, setAudience] = useState("Design-minded movers");
  const [channel, setChannel] = useState("Social");
  const [tone, setTone] = useState("Confident");
  const [visualStyle, setVisualStyle] = useState("Editorial");
  const [variant, setVariant] = useState<Variant>("A");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("Ready to create a campaign direction.");
  const [revision, setRevision] = useState(1);
  const [recent, setRecent] = useState(campaigns);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const loadRecent = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(storageKey);
        if (saved) {
          const parsed: unknown = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const entries = parsed.filter(isCampaign).slice(0, 3);
            if (entries.length) setRecent(entries);
          }
        }
      } catch { /* Private browsing may disable storage; the studio still works. */ }
    }, 0);
    return () => { window.clearTimeout(loadRecent); if (timeout.current) clearTimeout(timeout.current); };
  }, []);

  const generate = () => {
    if (timeout.current) clearTimeout(timeout.current);
    if (brief.trim().length < 20) {
      setStatus("error");
      setMessage("Add at least 20 characters to the brief, then generate again.");
      return;
    }
    setStatus("loading");
    setMessage("Building three directions for your brief…");
    timeout.current = setTimeout(() => {
      setRevision((current) => current + 1);
      setVariant("A");
      setStatus("success");
      setMessage("Three directions are ready. Select A, B, or C to compare them.");
    }, 750);
  };

  const save = () => {
    if (brief.trim().length < 20) {
      setStatus("error");
      setMessage("Add a fuller brief before saving this campaign.");
      return;
    }
    const entry: Campaign = { title: `Luma One · direction ${variant}`, when: "Just now", brief, audience, channel, tone, visualStyle, variant, revision };
    const next = [entry, ...recent].slice(0, 3);
    setRecent(next);
    try { window.localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* Optional local persistence. */ }
    setStatus("success");
    setMessage(`Direction ${variant} saved to recent campaigns.`);
  };

  const openCampaign = (entry: Campaign) => {
    if (timeout.current) clearTimeout(timeout.current);
    setBrief(entry.brief);
    setAudience(entry.audience);
    setChannel(entry.channel);
    setTone(entry.tone);
    setVisualStyle(entry.visualStyle);
    setVariant(entry.variant);
    setRevision(entry.revision);
    setStatus("success");
    setMessage(`${entry.title} opened from recent campaigns.`);
  };

  const exportCampaign = () => {
    const directions = Object.fromEntries((["A", "B", "C"] as const).map((direction) => [direction, resolveCreative(direction, tone, revision, brief)]));
    const payload = { model: "GPT-6 Sol", modelId: "gpt-6-sol", brief, audience, channel, tone, visualStyle, selected: variant, revision, selectedCreative: resolveCreative(variant, tone, revision, brief), directions, simulation: true };
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `muse-luma-one-${variant.toLowerCase()}.json`;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus("success");
    setMessage(`Direction ${variant} exported as JSON.`);
  };

  return { brief, setBrief, audience, setAudience, channel, setChannel, tone, setTone, visualStyle, setVisualStyle, variant, setVariant, status, message, revision, recent, generate, save, openCampaign, exportCampaign };
}

export type StudioState = ReturnType<typeof useStudio>;

export function Shell({ id, state, children }: { id: ShowcaseId; state: StudioState; children: React.ReactNode }) {
  return <main className={styles.page} data-design={id}>
    <div className={styles.shell}>
      <h1 className={styles.srOnly}>Muse Campaign Studio · GPT-6 Sol · {showcaseDetails[id].name}</h1>
      <header className={styles.header}>
        <div className={styles.brand}><span className={styles.brandMark}>m<span>.</span></span><span>Muse <b>Campaign Studio</b></span></div>
        <div className={styles.identity}><strong>GPT-6 Sol</strong><span>{showcaseDetails[id].skills}</span></div>
      </header>
      <div className={styles.status} data-status={state.status} role="status" aria-live="polite">
        {state.status === "error" ? <CircleAlert size={15} /> : state.status === "success" ? <Check size={15} /> : state.status === "loading" ? <span className={styles.spinner} /> : <Sparkles size={15} />}
        <span>{state.message}</span>
        <small>Concept {showcaseIds.indexOf(id) + 1} / 18 · {showcaseDetails[id].name}</small>
      </div>
      {children}
    </div>
  </main>;
}

export function Section({ title, detail, children, className = "", id }: { title: string; detail?: string; children: React.ReactNode; className?: string; id?: string }) {
  return <section id={id} className={`${styles.section} ${className}`}><div className={styles.sectionHead}><h2>{title}</h2>{detail && <span>{detail}</span>}</div>{children}</section>;
}

export function Brief({ state }: { state: StudioState }) {
  return <div className={styles.brief}><label htmlFor="muse-brief">Campaign brief</label><textarea id="muse-brief" value={state.brief} onChange={(event) => state.setBrief(event.target.value)} rows={4} aria-describedby="brief-hint" /><span id="brief-hint">Describe the product, promise, and launch moment.</span></div>;
}

const selectOptions = {
  audience: ["Design-minded movers", "Urban creatives", "First-home makers", "Night owls"],
  channel: ["Social", "Email", "Web", "Out of home"],
  tone: ["Confident", "Warm", "Playful", "Minimal"],
  visualStyle: ["Editorial", "Cinematic", "Graphic", "Quiet luxury"],
};

export function Controls({ state }: { state: StudioState }) {
  return <div className={styles.controls}>
    <label>Audience<select aria-label="Audience" value={state.audience} onChange={(event) => state.setAudience(event.target.value)}>{selectOptions.audience.map((value) => <option key={value}>{value}</option>)}</select></label>
    <label>Channel<select aria-label="Channel" value={state.channel} onChange={(event) => state.setChannel(event.target.value)}>{selectOptions.channel.map((value) => <option key={value}>{value}</option>)}</select></label>
    <label>Tone<select aria-label="Tone" value={state.tone} onChange={(event) => state.setTone(event.target.value)}>{selectOptions.tone.map((value) => <option key={value}>{value}</option>)}</select></label>
    <label>Visual style<select aria-label="Visual style" value={state.visualStyle} onChange={(event) => state.setVisualStyle(event.target.value)}>{selectOptions.visualStyle.map((value) => <option key={value}>{value}</option>)}</select></label>
  </div>;
}

export function Variants({ state }: { state: StudioState }) {
  return <div className={styles.variants} role="group" aria-label="Campaign directions">
    {(["A", "B", "C"] as const).map((value) => <button type="button" key={value} aria-pressed={state.variant === value} onClick={() => state.setVariant(value)}><b>{value}</b><span>{resolveCreative(value, state.tone, state.revision, state.brief).headline}</span></button>)}
  </div>;
}

export function Creative({ state, scene = "blue", format = "landscape" }: { state: StudioState; scene?: "blue" | "night" | "mint" | "stone"; format?: "landscape" | "portrait" | "wide" }) {
  const current = resolveCreative(state.variant, state.tone, state.revision, state.brief);
  return <div className={styles.creative} data-scene={scene} data-format={format} data-variant={state.variant} data-style={state.visualStyle}>
    <div className={styles.creativeText}><span className={styles.creativeBrand}>LUMA ONE</span><strong>{current.headline}</strong><p>{current.body}</p><span className={styles.creativeLink}>Discover the light <span aria-hidden="true">↗</span></span></div>
    <div className={styles.creativeFoot}><span>CAMPAIGN / {state.channel.toUpperCase()}</span><span>{state.variant} — 03</span></div>
  </div>;
}

export function Metrics({ state }: { state: StudioState }) {
  const current = variants[state.variant];
  return <div className={styles.metrics} aria-label="Simulated campaign metrics"><div><span>Reach</span><strong>{current.reach + (state.revision - 1) * 2}k</strong></div><div><span>CTR</span><strong>{current.ctr.toFixed(1)}%</strong></div><div><span>Conversion</span><strong>{current.conversion.toFixed(1)}%</strong></div><small>Simulated estimates · direction {state.variant}</small></div>;
}

export function Actions({ state }: { state: StudioState }) {
  return <div className={styles.actions}><button type="button" className={styles.primary} onClick={state.generate} disabled={state.status === "loading"}><Play size={15} fill="currentColor" />{state.status === "loading" ? "Generating…" : "Generate"}</button><button type="button" onClick={state.save}><Bookmark size={15} />Save</button><button type="button" onClick={state.exportCampaign}><ArrowDownToLine size={15} />Export</button></div>;
}

export function SystemActions({ state }: { state: StudioState }) {
  return <div className={styles.actions}><Button type="button" className={styles.primary} onClick={state.generate} disabled={state.status === "loading"}><Play size={15} fill="currentColor" />{state.status === "loading" ? "Generating…" : "Generate"}</Button><Button type="button" variant="outline" onClick={state.save}><Bookmark size={15} />Save</Button><Button type="button" variant="outline" onClick={state.exportCampaign}><ArrowDownToLine size={15} />Export</Button></div>;
}

export function Recent({ state }: { state: StudioState }) {
  return <div className={styles.recent}><div className={styles.recentTitle}><strong>Recent campaigns</strong><span>Local workspace</span></div>{state.recent.map((item, index) => <button type="button" className={styles.recentRow} key={`${item.title}-${index}`} aria-label={`Open ${item.title}`} onClick={() => state.openCampaign(item)}><span>{item.title}</span><small>{item.channel} · {item.when}</small></button>)}</div>;
}

export function DirectionNote({ state }: { state: StudioState }) {
  return <div className={styles.directionNote}><span>Selected direction / {state.variant}</span><strong>{variants[state.variant].line}</strong><p>{state.audience} · {state.tone.toLowerCase()} tone · {state.visualStyle.toLowerCase()} art direction</p></div>;
}

export { styles };
