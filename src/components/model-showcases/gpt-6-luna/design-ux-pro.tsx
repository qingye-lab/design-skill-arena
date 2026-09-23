"use client";

import { BriefField, CampaignActions, CampaignControls, CampaignPreview, Forecast, PageTitle, Panel, RecentCampaigns, StudioShell, VariantPicker, useCampaign } from "./campaign-studio";
import type { ShowcaseId } from "./campaign-data";
import styles from "./campaign-studio.module.css";

export default function DesignUxPro() {
  const state = useCampaign();
  const id: ShowcaseId = "design-ux-pro";
  return <StudioShell id={id} state={state}><div className={styles.layoutDesignUxPro}>
    <section className={styles.uxProBrief}><PageTitle detail="Set the signal before choosing a format">Launch brief</PageTitle><Panel title="What should people remember?"><BriefField state={state} /></Panel><Panel title="Audience & expression"><CampaignControls state={state} compact /></Panel><CampaignActions state={state} /></section>
    <section className={styles.uxProPreview} aria-label="Campaign preview"><VariantPicker state={state} /><CampaignPreview state={state} /><Forecast state={state} inline /></section>
    <aside className={styles.uxProSummary}><Panel title="Modelled response"><Forecast state={state} /></Panel><Panel><RecentCampaigns state={state} /></Panel></aside>
  </div></StudioShell>;
}
