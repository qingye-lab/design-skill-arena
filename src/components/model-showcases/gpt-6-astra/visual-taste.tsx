"use client";

// Visual + Taste: Color-drenched creative art table. A large live campaign statement is paired with the photographic product proof; variant selection runs as a full-width typographic strip beneath it. Brief and distribution controls form an unboxed lower desk. On mobile the live statement scales down, product retains height, and choices become large stacked rows.
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AlertCircle, Bookmark, Check, Clock3, Download, LoaderCircle, Sparkles } from "lucide-react";
import s from "./visual-taste.module.css";

type Draft = { brief: string; audience: string; channel: string; tone: string; style: string };
type Phase = "idle" | "loading" | "success" | "error";
const defaults: Draft = {"brief": "Introduce Sol everyday sunscreen to people who spend their free time in the sun.", "audience": "Sun seekers", "channel": "Instagram", "tone": "Playful", "style": "Editorial"};
const options = {"audience": ["Sun seekers", "Weekend adventurers", "Everyday commuters"], "channel": ["Instagram", "TikTok", "Email"], "tone": ["Playful", "Warm", "Confident"], "style": ["Editorial", "Studio", "Minimal"]};
const ideas = [{"name": "Out there", "headline": "Meet you outside."}, {"name": "Golden hour", "headline": "Stay for the last light."}, {"name": "Sun people", "headline": "Made for days like this."}];
const storageKey = "muse:gpt-6-astra:visual-taste";

export default function Showcase() {
  const [draft, setDraft] = useState<Draft>(defaults);
  const [direction, setDirection] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [cycle, setCycle] = useState(0);
  const [notice, setNotice] = useState("");
  const [events, setEvents] = useState(["Three creative directions prepared", "Sol / out of office created"]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const running = useRef(false);
  const briefRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const busy = phase === "loading";
  const idea = ideas[direction];
  const reach = 158 + direction * 19 + cycle * 3 + options.audience.indexOf(draft.audience) * 9 + options.channel.indexOf(draft.channel) * 12;
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
        log("Generation needs a more detailed brief");
        requestAnimationFrame(() => briefRef.current?.focus());
        return;
      }
      setCycle(current=>current+1); setPhase("success"); setNotice("Campaign generated. Your creative and forecast are ready.");
       log(`Generated revision ${cycle+2} for ${draft.channel}`);
    }, 1100);
  }
  function snapshot() { return {model:"GPT 6 Astra",showcase:"visual-taste",skills:"frontend-skill + taste-skill",draft,concept:{...idea,index:direction},revision:cycle+1,forecast:{reach,ctr:Number(ctr),conversion:Number(conversion),basis:"Local illustrative mock data / 14 days"}}; }
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
      const link=document.createElement("a");link.href=url;link.download="muse-visual-taste.json";document.body.appendChild(link);link.click();link.remove();
      setPhase("success");setNotice("Campaign exported as JSON.");log("Exported current creative and forecast");
    } catch {setPhase("error");setNotice("Export failed. Save a local copy and try again.");}
    finally {if(url){const downloadUrl=url;setTimeout(()=>URL.revokeObjectURL(downloadUrl),1000);}}
  }
  const identity=<div className={s.identity}><span className={s.model}><Sparkles/> GPT 6 Astra</span><span className={s.chain}><b>Visual + Taste</b>frontend-skill + taste-skill</span></div>;
  const briefField=<label className={s.field} htmlFor="campaign-brief">Campaign Brief<textarea ref={briefRef} id="campaign-brief" data-testid="brief" value={draft.brief} disabled={busy} aria-invalid={phase === "error" && draft.brief.trim().length < 12} aria-describedby="campaign-feedback" maxLength={1200} onChange={e=>change("brief",e.target.value)} onKeyDown={e=>{if((e.metaKey||e.ctrlKey)&&e.key === "Enter"){e.preventDefault();generateCampaign();}}} placeholder="Describe the product and the launch…"/></label>;
  const generate=<button className={s.primary} data-testid="generate" disabled={busy} onClick={generateCampaign}>{busy ? <LoaderCircle className={s.spinner}/> : <Sparkles/>}{busy ? "Generating…" : "Generate"}</button>;
  const save=<button className={s.secondary} data-testid="save" disabled={busy} onClick={saveCampaign}><Bookmark/> Save</button>;
  const exportButton=<button className={s.secondary} data-testid="export" disabled={busy} onClick={exportCampaign}><Download/> Export</button>;
  const restore=<button className={s.restore} data-testid="restore" disabled={busy} onClick={restoreCampaign}>Restore saved campaign</button>;
  const feedback=<div id="campaign-feedback" className={s.feedback} role={phase === "error" ? "alert" : "status"} aria-live="polite" data-testid="feedback" data-state={phase}>{notice && (phase === "error" ? <AlertCircle/> : phase === "success" ? <Check/> : null)}<span>{notice}</span></div>;
  const activity=<section className={s.activity} aria-label="Recent activity"><h2>Activity</h2><ul>{events.map((event,i)=><li key={`${i}-${event}`}><Clock3/><span>{event}</span></li>)}</ul></section>;
  const forecast=<div className={s.forecast} data-testid="forecast">{metrics.map(metric=><div key={metric.label} className={s.metric}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}</div>;
  const concepts=<div className={s.concepts} aria-label="Creative directions">{ideas.map((item,i)=><button key={item.name} className={s.idea} data-testid={`concept-${String.fromCharCode(65+i)}`} aria-label={`Select concept ${String.fromCharCode(65+i)}: ${item.name}`} aria-pressed={direction === i} disabled={busy} onClick={()=>choose(i)}><strong>{String.fromCharCode(65+i)}</strong><span>{item.name}</span><small>{item.headline}</small></button>)}</div>;
  const preview=<figure className={s.preview} data-testid="preview" data-tone={draft.tone} data-style={draft.style}  aria-busy={busy}>
    <Image src="/model-screenshots/gpt-6-astra/visual-taste/art.png" alt="Sol / out of office product campaign photography" width={1536} height={1024} priority className={s.image} style={{filter:draft.style === "Minimal" ? "saturate(.45)" : draft.style === "Studio" ? "contrast(1.1) saturate(1.1)" : "none",objectPosition:`${50+direction*9}% center`}}/>
    <h2 className={s.headline} key={`${direction}-${cycle}`}>{idea.headline}</h2>
    <figcaption className={s.caption}><strong>{idea.name} · {draft.channel} · {draft.tone}</strong><span>{draft.brief.trim() ? draft.brief.slice(0,125) : "Add your campaign brief to shape this creative."}</span><span>{draft.audience} / {draft.style} · Revision {cycle+1}</span></figcaption>
    {busy && <div className={s.loadingVeil}><LoaderCircle className={s.spinner}/><span>Generating campaign…</span></div>}
  </figure>;
  const audience=<label className={s.field} htmlFor="audience">Target audience<select id="audience" data-testid="audience" disabled={busy} value={draft.audience} onChange={e=>change("audience",e.target.value)}>{options.audience.map(item=><option key={item}>{item}</option>)}</select></label>;
  const channel=<label className={s.field} htmlFor="channel">Channel<select id="channel" data-testid="channel" disabled={busy} value={draft.channel} onChange={e=>change("channel",e.target.value)}>{options.channel.map(item=><option key={item}>{item}</option>)}</select></label>;
  const tone=<fieldset className={s.field} disabled={busy}><legend>Tone</legend><div className={s.options} data-testid="tone">{options.tone.map(item=><button type="button" key={item} className={s.option} aria-pressed={draft.tone === item} onClick={()=>change("tone",item)}>{item}</button>)}</div></fieldset>;
  const style=<label className={s.field} htmlFor="style">Visual style<select id="style" data-testid="style" disabled={busy} value={draft.style} onChange={e=>change("style",e.target.value)}>{options.style.map(item=><option key={item}>{item}</option>)}</select></label>;
  return <main id="campaign-workspace" lang="en" className={s.root}><a className={s.skip} href="#campaign-brief">Skip to campaign brief</a><header className={s.header}><div className={s.brand}>muse.</div>{identity}<div className={s.actions}>{save}{exportButton}</div></header><div className={s.editorTitle}><h1>Sol / Out of office</h1><span>Summer launch · Working direction {String.fromCharCode(65 + direction)}</span></div><section className={s.artTable}><div className={s.statement}><span>Creative direction</span><h2 key={direction}>{idea.headline}</h2><p>{draft.tone} · For {draft.audience.toLowerCase()}</p><div className={s.statementForecast}>{forecast}<span>Mock forecast / 14 days</span></div></div><div className={s.proof}>{preview}<span className={s.proofStamp}>SOL / EVERYDAY SUNSCREEN</span></div></section><section className={s.directionStrip}>{concepts}</section><section className={s.productionDesk}><div className={s.brief}>{briefField}{generate}{feedback}</div><div className={s.controls}>{audience}{channel}{tone}{style}</div><div className={s.activityDesk}>{activity}{restore}</div></section></main>;
}
