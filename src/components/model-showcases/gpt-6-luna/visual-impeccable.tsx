"use client";

import { BriefField, CampaignActions, CampaignControls, CampaignPreview, Forecast, PageTitle, RecentCampaigns, StudioShell, VariantPicker, useCampaign } from "./campaign-studio";
import type { ShowcaseId } from "./campaign-data";
import styles from "./campaign-studio.module.css";

export default function VisualImpeccable() {
  const state = useCampaign();
  const id: ShowcaseId = "visual-impeccable";
  return <StudioShell id={id} state={state}><div className={styles.layoutVisualImpeccable}>
    <nav className={styles.visualRail} aria-label="Choose a campaign direction"><VariantPicker state={state} /></nav>
    <section className={styles.visualImpeccableCanvas}><PageTitle detail="A bright canvas for a considered launch">Make sound tangible.</PageTitle><CampaignPreview state={state} /><Forecast state={state} inline /></section>
    <aside className={styles.visualInspector}><BriefField state={state} /><CampaignControls state={state} compact /><CampaignActions state={state} /><RecentCampaigns state={state} /></aside>
  </div></StudioShell>;
}
