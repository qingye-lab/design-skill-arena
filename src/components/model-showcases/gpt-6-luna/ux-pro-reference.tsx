"use client";

import { BriefField, CampaignActions, CampaignControls, CampaignPreview, Forecast, PageTitle, Panel, RecentCampaigns, StudioShell, VariantPicker, useCampaign } from "./campaign-studio";
import type { ShowcaseId } from "./campaign-data";
import styles from "./campaign-studio.module.css";

export default function UxProReference() {
  const state = useCampaign();
  const id: ShowcaseId = "ux-pro-reference";
  return <StudioShell id={id} state={state}><div className={styles.layoutUxPro}>
    <nav className={styles.uxJourney} aria-label="Campaign journey"><h2>Launch journey</h2><a href="#campaign-brief" aria-current="step"><span>1</span> Brief</a><a href="#campaign-audience"><span>2</span> Audience</a><a href="#campaign-visual-style"><span>3</span> Expression</a><a href="#campaign-preview"><span>4</span> Preview</a></nav>
    <section className={styles.uxInput}><PageTitle detail="Start with the essentials">Your launch</PageTitle><Panel title="Brief"><BriefField state={state} /></Panel><Panel title="Audience & expression"><CampaignControls state={state} compact /></Panel><CampaignActions state={state} /></section>
    <section className={styles.uxPreview} aria-label="Campaign preview"><VariantPicker state={state} /><CampaignPreview state={state} /><div className={styles.uxFooter}><Panel><Forecast state={state} inline /></Panel><Panel><RecentCampaigns state={state} /></Panel></div></section>
  </div></StudioShell>;
}
