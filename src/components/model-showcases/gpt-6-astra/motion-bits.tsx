"use client";

// Motion Bits: A motion editing desk rather than a static dashboard. Kinetic word reveal replays when direction changes; an explicit Play/Pause control drives a three-frame timeline with keyboard-operable frame buttons. The campaign brief and controls live below the stage. Reduced motion preserves static frames and skips choreography; mobile stacks frame strip, preview, editor.
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AlertCircle, AudioLines, Bookmark, Check, Clock3, Download, LoaderCircle, Pause, Play, Sparkles } from "lucide-react";
import s from "./motion-bits.module.css";

type Draft = { brief: string; audience: string; channel: string; tone: string; style: string };
type Phase = "idle" | "loading" | "success" | "error";
const defaults: Draft = {"brief": "Launch Pulse studio headphones for a new generation of independent music makers.", "audience": "Music makers", "channel": "Instagram", "tone": "Playful", "style": "Editorial"};
const options = {"audience": ["Music makers", "Independent artists", "Everyday listeners"], "channel": ["Instagram", "TikTok", "Email"], "tone": ["Playful", "Warm", "Confident"], "style": ["Editorial", "Studio", "Minimal"]};
const ideas = [{"name": "Feel it", "headline": "Find your frequency."}, {"name": "Make noise", "headline": "Leave a little louder."}, {"name": "All yours", "headline": "Your sound. Your world."}];
const storageKey = "muse:gpt-6-astra:motion-bits";

export default function Showcase() {
  const [draft, setDraft] = useState<Draft>(defaults);
  const [direction, setDirection] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [cycle, setCycle] = useState(0);
  const [notice, setNotice] = useState("");
  const [events, setEvents] = useState(["Three creative directions prepared", "Pulse / frequency shift created"]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const running = useRef(false);
  const briefRef = useRef<HTMLTextAreaElement>(null);
  const [playing, setPlaying] = useState(false);
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    if (!playing) return;
    const tick = window.setInterval(() => setFrame(f => (f + 1) % 3), 1500);
    return () => window.clearInterval(tick);
  }, [playing]);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const busy = phase === "loading";
  const idea = ideas[direction];
  const reach = 149 + direction * 19 + cycle * 3 + options.audience.indexOf(draft.audience) * 9 + options.channel.indexOf(draft.channel) * 12;
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
  function snapshot() { return {model:"GPT 6 Astra",showcase:"motion-bits",skills:"react-bits",draft,concept:{...idea,index:direction},revision:cycle+1,forecast:{reach,ctr:Number(ctr),conversion:Number(conversion),basis:"Local illustrative mock data / 14 days"}}; }
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
      const link=document.createElement("a");link.href=url;link.download="muse-motion-bits.json";document.body.appendChild(link);link.click();link.remove();
      setPhase("success");setNotice("Campaign exported as JSON.");log("Exported current creative and forecast");
    } catch {setPhase("error");setNotice("Export failed. Save a local copy and try again.");}
    finally {if(url){const downloadUrl=url;setTimeout(()=>URL.revokeObjectURL(downloadUrl),1000);}}
  }
  const identity=<div className={s.identity}><span className={s.model}><Sparkles/> GPT 6 Astra</span><span className={s.chain}><b>Motion Bits</b>react-bits</span></div>;
  const briefField=<label className={s.field} htmlFor="campaign-brief">Campaign Brief<textarea ref={briefRef} id="campaign-brief" data-testid="brief" value={draft.brief} disabled={busy} aria-invalid={phase === "error" && draft.brief.trim().length < 12} aria-describedby="campaign-feedback" maxLength={1200} onChange={e=>change("brief",e.target.value)} onKeyDown={e=>{if((e.metaKey||e.ctrlKey)&&e.key === "Enter"){e.preventDefault();generateCampaign();}}} placeholder="Describe the product and the launch…"/></label>;
  const generate=<button className={s.primary} data-testid="generate" disabled={busy} onClick={generateCampaign}>{busy ? <LoaderCircle className={s.spinner}/> : <Sparkles/>}{busy ? "Generating…" : "Generate"}</button>;
  const save=<button className={s.secondary} data-testid="save" disabled={busy} onClick={saveCampaign}><Bookmark/> Save</button>;
  const exportButton=<button className={s.secondary} data-testid="export" disabled={busy} onClick={exportCampaign}><Download/> Export</button>;
  const restore=<button className={s.restore} data-testid="restore" disabled={busy} onClick={restoreCampaign}>Restore saved campaign</button>;
  const feedback=<div id="campaign-feedback" className={s.feedback} role={phase === "error" ? "alert" : "status"} aria-live="polite" data-testid="feedback" data-state={phase}>{notice && (phase === "error" ? <AlertCircle/> : phase === "success" ? <Check/> : null)}<span>{notice}</span></div>;
  const activity=<section className={s.activity} aria-label="Recent activity"><h2>Activity</h2><ul>{events.map((event,i)=><li key={`${i}-${event}`}><Clock3/><span>{event}</span></li>)}</ul></section>;
  const forecast=<div className={s.forecast} data-testid="forecast">{metrics.map(metric=><div key={metric.label} className={s.metric}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}</div>;
  const concepts=<div className={s.concepts} aria-label="Creative directions">{ideas.map((item,i)=><button key={item.name} className={s.idea} data-testid={`concept-${String.fromCharCode(65+i)}`} aria-label={`Select concept ${String.fromCharCode(65+i)}: ${item.name}`} aria-pressed={direction === i} disabled={busy} onClick={()=>choose(i)}><strong>{String.fromCharCode(65+i)}</strong><span>{item.name}</span><small>{item.headline}</small></button>)}</div>;
  const preview=<figure className={s.preview} data-testid="preview" data-tone={draft.tone} data-style={draft.style} data-frame={frame} aria-busy={busy}>
    <Image src="/model-screenshots/gpt-6-astra/motion-bits/art.png" alt="Pulse / frequency shift product campaign photography" width={1536} height={1024} priority className={s.image} style={{filter:draft.style === "Minimal" ? "saturate(.45)" : draft.style === "Studio" ? "contrast(1.1) saturate(1.1)" : "none",objectPosition:`${50+direction*9}% center`}}/>
    <h2 className={s.headline} key={`${direction}-${cycle}`}>{idea.headline}</h2>
    <figcaption className={s.caption}><strong>{idea.name} · {draft.channel} · {draft.tone}</strong><span>{draft.brief.trim() ? draft.brief.slice(0,125) : "Add your campaign brief to shape this creative."}</span><span>{draft.audience} / {draft.style} · Revision {cycle+1}</span></figcaption>
    {busy && <div className={s.loadingVeil}><LoaderCircle className={s.spinner}/><span>Generating campaign…</span></div>}
  </figure>;
  const audience=<label className={s.field} htmlFor="audience">Target audience<select id="audience" data-testid="audience" disabled={busy} value={draft.audience} onChange={e=>change("audience",e.target.value)}>{options.audience.map(item=><option key={item}>{item}</option>)}</select></label>;
  const channel=<fieldset className={s.field} disabled={busy}><legend>Channel</legend><div className={s.options} data-testid="channel">{options.channel.map(item=><button type="button" key={item} className={s.option} aria-pressed={draft.channel === item} onClick={()=>change("channel",item)}>{item}</button>)}</div></fieldset>;
  const tone=<fieldset className={s.field} disabled={busy}><legend>Tone</legend><div className={s.options} data-testid="tone">{options.tone.map(item=><button type="button" key={item} className={s.option} aria-pressed={draft.tone === item} onClick={()=>change("tone",item)}>{item}</button>)}</div></fieldset>;
  const style=<label className={s.field} htmlFor="style">Visual style<select id="style" data-testid="style" disabled={busy} value={draft.style} onChange={e=>change("style",e.target.value)}>{options.style.map(item=><option key={item}>{item}</option>)}</select></label>;
  return <main id="campaign-workspace" lang="en" className={s.root}><a className={s.skip} href="#campaign-brief">Skip to campaign brief</a><header className={s.header}><div className={s.brand}><AudioLines/> MUSE</div>{identity}<div className={s.actions}>{save}{exportButton}</div></header><div className={s.heading}><div><p>PULSE / LAUNCH FILM</p><h1>Frequency shift</h1></div><button className={s.playButton} aria-pressed={playing} onClick={()=>setPlaying(!playing)}>{playing ? <Pause/> : <Play/>}{playing ? 'Pause preview' : 'Play preview'}</button></div><section className={s.stage}>{preview}<div className={s.timecode}>00:0{frame * 2} / 00:06</div><div className={s.levels} aria-hidden="true">{[30,55,80,40,65,95,50,70,35,85,60,45].map((h,i)=><i key={i} style={{height: `${h}%`, animationPlayState: playing ? 'running' : 'paused', animationDelay:`${i*0.07}s`}}/>)}</div><div className={s.frameLabel}>{['Opening / The hook','Product / The feeling','End frame / The invitation'][frame]}</div></section><div className={s.timelineBar}><div className={s.frames}>{['Opening','Product','End frame'].map((label,i)=><button key={label} aria-pressed={frame === i} onClick={()=>{setPlaying(false);setFrame(i)}}><span>00:0{i*2}</span>{label}</button>)}</div>{concepts}</div><section className={s.controlDeck}><div>{briefField}{generate}{feedback}</div><div className={s.properties}>{audience}{channel}{tone}{style}</div><div className={s.impact}><h2>Campaign forecast</h2>{forecast}<p>Illustrative data / 14 days</p></div></section><footer className={s.footer}>{activity}{restore}</footer></main>;
}
