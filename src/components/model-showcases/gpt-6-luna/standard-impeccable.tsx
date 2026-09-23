"use client";

import { BriefField, CampaignActions, CampaignControls, CampaignPreview, Forecast, PageTitle, Panel, RecentCampaigns, StudioShell, VariantPicker, useCampaign } from "./campaign-studio";
import type { ShowcaseId } from "./campaign-data";
import styles from "./campaign-studio.module.css";

export default function StandardImpeccable() {
  const state = useCampaign();
  const id: ShowcaseId = "standard-impeccable";
  return <StudioShell id={id} state={state}><div className={styles.layoutStandardImpeccable}>
    <section className={styles.impeccableBrief}><BriefField state={state} /><CampaignControls state={state} /><CampaignActions state={state} /></section>
    <section className={styles.impeccableCanvas} aria-label="Campaign direction preview"><PageTitle detail="Morrow Arc / direction set">01 / The campaign</PageTitle><VariantPicker state={state} /><CampaignPreview state={state} /></section>
    <aside className={styles.impeccableData}><Panel title="Forecast"><Forecast state={state} /></Panel><Panel><RecentCampaigns state={state} /></Panel></aside>
  </div></StudioShell>;
}
