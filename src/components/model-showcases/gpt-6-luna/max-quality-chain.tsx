"use client";

import { BriefField, CampaignActions, CampaignControls, CampaignPreview, Forecast, PageTitle, RecentCampaigns, StudioShell, VariantPicker, useCampaign } from "./campaign-studio";
import type { ShowcaseId } from "./campaign-data";
import styles from "./campaign-studio.module.css";

export default function MaxQualityChain() {
  const state = useCampaign();
  const id: ShowcaseId = "max-quality-chain";
  return <StudioShell id={id} state={state}><div className={styles.layoutMaxQuality}>
    <nav className={styles.maxRail} aria-label="Campaign workspace sections"><h2>Arc / 01</h2><span aria-current="page">Canvas</span><span>Brief</span><span>Audience</span><span>Forecast</span></nav>
    <section className={styles.maxStage} aria-label="Campaign direction"><PageTitle detail="Creative command / Morrow Arc">Make a place for sound.</PageTitle><VariantPicker state={state} /><CampaignPreview state={state} /></section>
    <aside className={styles.maxInspector}><BriefField state={state} /><CampaignControls state={state} compact /><Forecast state={state} /><CampaignActions state={state} /><RecentCampaigns state={state} /></aside>
  </div></StudioShell>;
}
