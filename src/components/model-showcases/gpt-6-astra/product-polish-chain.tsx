"use client";

// Product Polish Chain: Product review workspace with a campaign checklist and editable inspector. Shadcn controls support keyboard navigation; a review completion checkbox is explicitly local and never implies publication. Preview sits above a compact comparison table with per-direction forecasts. Mobile retains controls and converts the comparison table to accessible horizontally scrollable content inside its own boundary.
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AlertCircle, Aperture, Bookmark, Check, Clock3, Download, LoaderCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import s from "./product-polish-chain.module.css";

type Draft = { brief: string; audience: string; channel: string; tone: string; style: string };
type Phase = "idle" | "loading" | "success" | "error";
const defaults: Draft = {"brief": "Launch Daylight pocket cameras for people who want to remember their everyday life.", "audience": "Everyday storytellers", "channel": "Instagram", "tone": "Clear", "style": "Editorial"};
const options = {"audience": ["Everyday storytellers", "Travel photographers", "Creative families"], "channel": ["Instagram", "TikTok", "Email"], "tone": ["Clear", "Warm", "Confident"], "style": ["Editorial", "Studio", "Minimal"]};
const ideas = [{"name": "Ordinary magic", "headline": "Keep the little things."}, {"name": "Look again", "headline": "There is more in your everyday."}, {"name": "Yours to keep", "headline": "A life worth looking back on."}];
const storageKey = "muse:gpt-6-astra:product-polish-chain";

export default function Showcase() {
  const [draft, setDraft] = useState<Draft>(defaults);
  const [direction, setDirection] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [cycle, setCycle] = useState(0);
  const [notice, setNotice] = useState("");
  const [events, setEvents] = useState(["Three creative directions prepared", "Daylight / keep the ordinary created"]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const running = useRef(false);
  const briefRef = useRef<HTMLTextAreaElement>(null);
  const [approved, setApproved] = useState(false);
  const [tab, setTab] = useState("brief");
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const busy = phase === "loading";
  const idea = ideas[direction];
  const reach = 176 + direction * 19 + cycle * 3 + options.audience.indexOf(draft.audience) * 9 + options.channel.indexOf(draft.channel) * 12;
  const ctr = (3.6 + direction * .5 + cycle * .1 + options.channel.indexOf(draft.channel) * .2).toFixed(1);
  const conversion = (2.1 + direction * .3 + cycle * .1 + options.audience.indexOf(draft.audience) * .2).toFixed(1);
  const metrics = [{label:"Reach",value:`${reach}k`},{label:"CTR",value:`${ctr}%`},{label:"Conversion",value:`${conversion}%`}];
  function log(message: string) { setEvents(current => [message, ...current].slice(0, 4)); }
  function change(key: keyof Draft, value: string) {
    if (running.current) return;
    setDraft(current => ({...current, [key]:value})); setPhase("idle"); setNotice("Unsaved changes"); setApproved(false);
    if (key !== "brief") log(`${key === "style" ? "Visual style" : key[0].toUpperCase()+key.slice(1)} changed to ${value}`);
  }
  function choose(next: number) {
    if (running.current) return;
    setDirection(next); setPhase("idle"); setNotice(`Concept ${String.fromCharCode(65+next)} selected`); setApproved(false);
    log(`Selected ${ideas[next].name}`);
  }
  function generateCampaign() {
    if (running.current) return;
    running.current = true; setPhase("loading"); setNotice("Generating creative directions…");
    timer.current = setTimeout(() => {
      running.current = false;
      if (draft.brief.trim().length < 12) {
        setPhase("error"); setNotice("Add a campaign brief of at least 12 characters, then Generate again.");
        log("Generation needs a more detailed brief"); setTab("brief");
        requestAnimationFrame(() => briefRef.current?.focus());
        return;
      }
      setCycle(current=>current+1); setPhase("success"); setNotice("Campaign generated. Your creative and forecast are ready.");
      setApproved(false); log(`Generated revision ${cycle+2} for ${draft.channel}`);
    }, 1100);
  }
  function snapshot() { return {model:"GPT 6 Astra",showcase:"product-polish-chain",skills:"frontend-app-builder + shadcn-best-practices + web-interface-guidelines + impeccable",draft,concept:{...idea,index:direction},revision:cycle+1,forecast:{reach,ctr:Number(ctr),conversion:Number(conversion),basis:"Local illustrative mock data / 14 days"}}; }
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
      setDraft(saved.draft);setDirection(saved.concept.index);setCycle(saved.revision-1);setPhase("success");setNotice("Saved campaign restored.");setApproved(false);log("Restored saved campaign");
    } catch {setPhase("error");setNotice("The saved copy could not be restored. Your current draft is unchanged.");}
  }
  function exportCampaign() {
    let url: string | undefined;
    try {
      const blob=new Blob([JSON.stringify(snapshot(),null,2)],{type:"application/json"});
      url=URL.createObjectURL(blob);
      const link=document.createElement("a");link.href=url;link.download="muse-product-polish-chain.json";document.body.appendChild(link);link.click();link.remove();
      setPhase("success");setNotice("Campaign exported as JSON.");log("Exported current creative and forecast");
    } catch {setPhase("error");setNotice("Export failed. Save a local copy and try again.");}
    finally {if(url){const downloadUrl=url;setTimeout(()=>URL.revokeObjectURL(downloadUrl),1000);}}
  }
  const identity=<div className={s.identity}><Badge variant="outline">GPT 6 Astra</Badge><span className={s.chain}><b>Product Polish Chain</b>frontend-app-builder + shadcn-best-practices + web-interface-guidelines + impeccable</span></div>;
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
    <Image src="/model-screenshots/gpt-6-astra/product-polish-chain/art.png" alt="Daylight / keep the ordinary product campaign photography" width={1536} height={1024} priority className={s.image} style={{filter:draft.style === "Minimal" ? "saturate(.45)" : draft.style === "Studio" ? "contrast(1.1) saturate(1.1)" : "none",objectPosition:`${50+direction*9}% center`}}/>
    <h2 className={s.headline} key={`${direction}-${cycle}`}>{idea.headline}</h2>
    <figcaption className={s.caption}><strong>{idea.name} · {draft.channel} · {draft.tone}</strong><span>{draft.brief.trim() ? draft.brief.slice(0,125) : "Add your campaign brief to shape this creative."}</span><span>{draft.audience} / {draft.style} · Revision {cycle+1}</span></figcaption>
    {busy && <div className={s.loadingVeil}><LoaderCircle className={s.spinner}/><span>Generating campaign…</span></div>}
  </figure>;
  const audience=<label className={s.field} htmlFor="audience">Target audience<select id="audience" data-testid="audience" disabled={busy} value={draft.audience} onChange={e=>change("audience",e.target.value)}>{options.audience.map(item=><option key={item}>{item}</option>)}</select></label>;
  const channel=<label className={s.field} htmlFor="channel">Channel<select id="channel" data-testid="channel" disabled={busy} value={draft.channel} onChange={e=>change("channel",e.target.value)}>{options.channel.map(item=><option key={item}>{item}</option>)}</select></label>;
  const tone=<label className={s.field} htmlFor="tone">Tone<select id="tone" data-testid="tone" disabled={busy} value={draft.tone} onChange={e=>change("tone",e.target.value)}>{options.tone.map(item=><option key={item}>{item}</option>)}</select></label>;
  const style=<label className={s.field} htmlFor="style">Visual style<select id="style" data-testid="style" disabled={busy} value={draft.style} onChange={e=>change("style",e.target.value)}>{options.style.map(item=><option key={item}>{item}</option>)}</select></label>;
  return <main id="campaign-workspace" lang="en" className={s.root}><a className={s.skip} href="#campaign-brief">Skip to campaign brief</a><header className={s.header}><div className={s.brand}><Aperture/> Muse</div><span className={s.path}>Campaigns / Daylight</span>{identity}<div className={s.actions}>{save}{exportButton}</div></header><div className={s.workspace}><div className={s.heading}><div><h1>Keep the ordinary</h1><p>Daylight launch campaign</p></div><Badge variant="outline">{approved ? 'Reviewed' : 'Draft'}</Badge>{generate}</div><div className={s.reviewGrid}><aside className={s.inspector}><Tabs value={tab} onValueChange={value=>setTab(String(value))}><TabsList><TabsTrigger value="brief">Brief</TabsTrigger><TabsTrigger value="review">Review</TabsTrigger></TabsList><TabsContent value="brief"><div className={s.form}>{briefField}{audience}{channel}{tone}{style}</div></TabsContent><TabsContent value="review"><div className={s.reviewChecklist}><h2>Campaign checklist</h2><p><Check/> Three directions prepared</p><p><Check/> Forecast attached</p><p><Check/> {draft.channel} selected</p><label><input type="checkbox" checked={approved} onChange={e=>setApproved(e.target.checked)}/> Creative reviewed</label><span>This marks your local working copy as reviewed.</span></div></TabsContent></Tabs>{feedback}{restore}</aside><section className={s.canvas}><div className={s.canvasHeader}><span>Creative preview</span><Badge variant="secondary">Concept {String.fromCharCode(65+direction)}</Badge></div>{preview}{concepts}<div className={s.forecastBlock}>{forecast}<p>Mock forecast · 14 days</p></div></section></div><div className={s.reviewBottom}><section className={s.comparison}><h2>Direction comparison</h2><div className={s.tableScroll}><table><thead><tr><th>Direction</th><th>Reach</th><th>CTR</th><th>Conversion</th></tr></thead><tbody>{ideas.map((item,i)=><tr key={item.name} aria-selected={direction === i}><td><button onClick={()=>choose(i)}>{String.fromCharCode(65+i)} · {item.name}</button></td><td>{128+i*19}k</td><td>{(3.6+i*.5).toFixed(1)}%</td><td>{(2.1+i*.3).toFixed(1)}%</td></tr>)}</tbody></table></div></section><aside>{activity}</aside></div></div></main>;
}
