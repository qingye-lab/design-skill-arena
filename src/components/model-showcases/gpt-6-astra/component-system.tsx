"use client";

// Component System: Component-led asset editor. Compact project toolbar, wide central canvas with contextual shadcn tabs, fixed-width inspector, asset metadata and activity at the bottom. Existing Button, Badge, Textarea and Tabs form the component vocabulary. Mobile replaces the side-by-side inspector with a tabbed edit/review surface.
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AlertCircle, Bookmark, Check, Clock3, Download, LoaderCircle, PanelsTopLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import s from "./component-system.module.css";

type Draft = { brief: string; audience: string; channel: string; tone: string; style: string };
type Phase = "idle" | "loading" | "success" | "error";
const defaults: Draft = {"brief": "Launch Scout, a technical travel pack for people who move between work and weekends.", "audience": "Weekend travelers", "channel": "Instagram", "tone": "Clear", "style": "Editorial"};
const options = {"audience": ["Weekend travelers", "City commuters", "Creative professionals"], "channel": ["Instagram", "TikTok", "Email"], "tone": ["Clear", "Warm", "Confident"], "style": ["Editorial", "Studio", "Minimal"]};
const ideas = [{"name": "Carry forward", "headline": "Pack for the possibility."}, {"name": "Work to weekend", "headline": "One bag. A different day."}, {"name": "Less baggage", "headline": "Take only what moves you."}];
const storageKey = "muse:gpt-6-astra:component-system";

export default function Showcase() {
  const [draft, setDraft] = useState<Draft>(defaults);
  const [direction, setDirection] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [cycle, setCycle] = useState(0);
  const [notice, setNotice] = useState("");
  const [events, setEvents] = useState(["Three creative directions prepared", "Scout / everyday, elsewhere created"]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const running = useRef(false);
  const briefRef = useRef<HTMLTextAreaElement>(null);
  const [priority, setPriority] = useState(45);
  const [tab, setTab] = useState("canvas");
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const busy = phase === "loading";
  const idea = ideas[direction];
  const reach = 146 + direction * 19 + cycle * 3 + options.audience.indexOf(draft.audience) * 9 + options.channel.indexOf(draft.channel) * 12 + Math.round((priority - 35) / 5);
  const ctr = (3.6 + direction * .5 + cycle * .1 + options.channel.indexOf(draft.channel) * .2).toFixed(1);
  const conversion = (2.1 + direction * .3 + cycle * .1 + options.audience.indexOf(draft.audience) * .2).toFixed(1);
  const metrics = [{label:"Reach",value:`${reach}k`},{label:"CTR",value:`${ctr}%`},{label:"Conversion",value:`${conversion}%`}];
  function log(message: string) { setEvents(current => [message, ...current].slice(0, 4)); }
  function change(key: keyof Draft, value: string) {
    if (running.current) return;
    setDraft(current => ({...current, [key]:value})); setPhase("idle"); setNotice("Unsaved changes");
    if (key !== "brief") log(`${key === "style" ? "Visual style" : key[0].toUpperCase()+key.slice(1)} changed to ${value}`);
  }
  function choose(next: number) {
    if (running.current) return;
    setDirection(next); setPhase("idle"); setNotice(`Concept ${String.fromCharCode(65+next)} selected`);
    log(`Selected ${ideas[next].name}`);
  }
  function generateCampaign() {
    if (running.current) return;
    running.current = true; setPhase("loading"); setNotice("Generating creative directions…");
    timer.current = setTimeout(() => {
      running.current = false;
      if (draft.brief.trim().length < 12) {
        setPhase("error"); setNotice("Add a campaign brief of at least 12 characters, then Generate again.");
        log("Generation needs a more detailed brief"); setTab("canvas");
        requestAnimationFrame(() => briefRef.current?.focus());
        return;
      }
      setCycle(current=>current+1); setPhase("success"); setNotice("Campaign generated. Your creative and forecast are ready.");
       log(`Generated revision ${cycle+2} for ${draft.channel}`);
    }, 1100);
  }
  function snapshot() { return {model:"GPT 6 Astra",showcase:"component-system",skills:"shadcn-best-practices / shadcn",draft,concept:{...idea,index:direction},revision:cycle+1,forecast:{reach,ctr:Number(ctr),conversion:Number(conversion),basis:"Local illustrative mock data / 14 days"}}; }
  function saveCampaign() {
    try { localStorage.setItem(storageKey, JSON.stringify(snapshot())); setPhase("success"); setNotice("Campaign saved in this browser."); log("Saved current campaign locally"); }
    catch { setPhase("error"); setNotice("This browser could not save the draft. Export a copy instead."); }
  }
  function restoreCampaign() {
    try {
      const raw=localStorage.getItem(storageKey);
      if (!raw) {setPhase("idle");setNotice("No saved campaign yet. Choose Save to keep a copy.");return;}
      const saved=JSON.parse(raw);
      if (!saved || typeof saved.draft?.brief !== "string" || !Number.isInteger(saved.concept?.index) || saved.concept.index < 0 || saved.concept.index > 2 || !Number.isInteger(saved.revision) || saved.revision < 1 || !Object.entries(options).every(([key,values])=>values.includes(saved.draft[key]))) throw new Error("Invalid draft");
      setDraft(saved.draft);setDirection(saved.concept.index);setCycle(saved.revision-1);setPhase("success");setNotice("Saved campaign restored.");log("Restored saved campaign");
    } catch {setPhase("error");setNotice("The saved copy could not be restored. Your current draft is unchanged.");}
  }
  function exportCampaign() {
    let url: string | undefined;
    try {
      const blob=new Blob([JSON.stringify(snapshot(),null,2)],{type:"application/json"});
      url=URL.createObjectURL(blob);
      const link=document.createElement("a");link.href=url;link.download="muse-component-system.json";document.body.appendChild(link);link.click();link.remove();
      setPhase("success");setNotice("Campaign exported as JSON.");log("Exported current creative and forecast");
    } catch {setPhase("error");setNotice("Export failed. Save a local copy and try again.");}
    finally {if(url){const downloadUrl=url;setTimeout(()=>URL.revokeObjectURL(downloadUrl),1000);}}
  }
  const identity=<div className={s.identity}><Badge variant="outline">GPT 6 Astra</Badge><span className={s.chain}><b>Component System</b>shadcn-best-practices / shadcn</span></div>;
  const briefField=<label className={s.field} htmlFor="campaign-brief">Campaign Brief<Textarea ref={briefRef} id="campaign-brief" data-testid="brief" value={draft.brief} disabled={busy} aria-invalid={phase === "error" && draft.brief.trim().length < 12} aria-describedby="campaign-feedback" maxLength={1200} onChange={e=>change("brief",e.target.value)} onKeyDown={e=>{if((e.metaKey||e.ctrlKey)&&e.key === "Enter"){e.preventDefault();generateCampaign();}}} placeholder="Describe the product and the launch…"/></label>;
  const generate=<Button className={s.primary} data-testid="generate" disabled={busy} onClick={generateCampaign}>{busy ? <LoaderCircle className={s.spinner}/> : <Sparkles/>}{busy ? "Generating…" : "Generate"}</Button>;
  const save=<Button variant="outline" className={s.secondary} data-testid="save" disabled={busy} onClick={saveCampaign}><Bookmark/> Save</Button>;
  const exportButton=<Button variant="outline" className={s.secondary} data-testid="export" disabled={busy} onClick={exportCampaign}><Download/> Export</Button>;
  const restore=<button className={s.restore} data-testid="restore" disabled={busy} onClick={restoreCampaign}>Restore saved campaign</button>;
  const feedback=<div id="campaign-feedback" className={s.feedback} role={phase === "error" ? "alert" : "status"} aria-live="polite" data-testid="feedback" data-state={phase}>{notice && (phase === "error" ? <AlertCircle/> : phase === "success" ? <Check/> : null)}<span>{notice}</span></div>;
  const activity=<section className={s.activity} aria-label="Recent activity"><h2>Activity</h2><ul>{events.map((event,i)=><li key={`${i}-${event}`}><Clock3/><span>{event}</span></li>)}</ul></section>;
  const forecast=<div className={s.forecast} data-testid="forecast">{metrics.map(metric=><div key={metric.label} className={s.metric}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}</div>;
  const concepts=<div className={s.concepts} aria-label="Creative directions">{ideas.map((item,i)=><button key={item.name} className={s.idea} data-testid={`concept-${String.fromCharCode(65+i)}`} aria-label={`Select concept ${String.fromCharCode(65+i)}: ${item.name}`} aria-pressed={direction === i} disabled={busy} onClick={()=>choose(i)}><strong>{String.fromCharCode(65+i)}</strong><span>{item.name}</span><small>{item.headline}</small></button>)}</div>;
  const preview=<figure className={s.preview} data-testid="preview" data-tone={draft.tone} data-style={draft.style}  aria-busy={busy}>
    <Image src="/model-screenshots/gpt-6-astra/component-system/art.png" alt="Scout / everyday, elsewhere product campaign photography" width={1536} height={1024} priority className={s.image} style={{filter:draft.style === "Minimal" ? "saturate(.45)" : draft.style === "Studio" ? "contrast(1.1) saturate(1.1)" : "none",objectPosition:`${50+direction*9}% center`}}/>
    <h2 className={s.headline} key={`${direction}-${cycle}`}>{idea.headline}</h2>
    <figcaption className={s.caption}><strong>{idea.name} · {draft.channel} · {draft.tone}</strong><span>{draft.brief.trim() ? draft.brief.slice(0,125) : "Add your campaign brief to shape this creative."}</span><span>{draft.audience} / {draft.style} · Revision {cycle+1}</span></figcaption>
    {busy && <div className={s.loadingVeil}><LoaderCircle className={s.spinner}/><span>Generating campaign…</span></div>}
  </figure>;
  const audience=<label className={s.field} htmlFor="audience">Target audience<select id="audience" data-testid="audience" disabled={busy} value={draft.audience} onChange={e=>change("audience",e.target.value)}>{options.audience.map(item=><option key={item}>{item}</option>)}</select></label>;
  const channel=<label className={s.field} htmlFor="channel">Channel<select id="channel" data-testid="channel" disabled={busy} value={draft.channel} onChange={e=>change("channel",e.target.value)}>{options.channel.map(item=><option key={item}>{item}</option>)}</select></label>;
  const tone=<label className={s.field} htmlFor="tone">Tone<select id="tone" data-testid="tone" disabled={busy} value={draft.tone} onChange={e=>change("tone",e.target.value)}>{options.tone.map(item=><option key={item}>{item}</option>)}</select></label>;
  const style=<label className={s.field} htmlFor="style">Visual style<select id="style" data-testid="style" disabled={busy} value={draft.style} onChange={e=>change("style",e.target.value)}>{options.style.map(item=><option key={item}>{item}</option>)}</select></label>;
  return <main id="campaign-workspace" lang="en" className={s.root}><a className={s.skip} href="#campaign-brief">Skip to campaign brief</a><header className={s.header}><div className={s.brand}><PanelsTopLeft/> Muse</div><span className={s.breadcrumb}>Workspace / Scout launch</span>{identity}<div className={s.actions}>{save}{exportButton}</div></header><div className={s.commandbar}><h1>Scout campaign</h1><Badge variant="secondary">Draft {cycle + 1}</Badge><div className={s.actionEnd}>{generate}</div></div><Tabs value={tab} onValueChange={value=>setTab(String(value))} className={s.modeTabs}><TabsList><TabsTrigger value="canvas">Creative canvas</TabsTrigger><TabsTrigger value="settings">Campaign settings</TabsTrigger></TabsList><TabsContent value="canvas"><div className={s.editorGrid}><section className={s.canvas}><div className={s.canvasToolbar}><span>Social creative / 4:3</span><span>{idea.name}</span></div>{preview}{concepts}</section><aside className={s.inspector}><h2>Campaign properties</h2>{briefField}<div className={s.properties}>{audience}{channel}{tone}{style}</div>{feedback}{restore}</aside></div></TabsContent><TabsContent value="settings"><section className={s.settingsView}><h2>Campaign settings</h2><p>Scout launch / Local workspace</p><label className={s.rangeLabel}>Campaign priority<input aria-label="Campaign priority" type="range" value={priority} min="0" max="100" onChange={e=>setPriority(Number(e.target.value))}/></label><dl><dt>Output</dt><dd>{draft.channel}</dd><dt>Audience</dt><dd>{draft.audience}</dd><dt>Creative</dt><dd>{idea.name}</dd></dl>{restore}</section></TabsContent></Tabs><footer className={s.bottomPanel}><section><h2>Performance forecast <span>Mock data</span></h2>{forecast}</section>{activity}</footer></main>;
}
