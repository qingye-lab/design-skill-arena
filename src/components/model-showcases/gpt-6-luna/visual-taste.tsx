"use client";

import { BriefField, CampaignActions, CampaignControls, CampaignPreview, Forecast, PageTitle, RecentCampaigns, StudioShell, VariantPicker, useCampaign } from "./campaign-studio";
import type { ShowcaseId } from "./campaign-data";
import styles from "./campaign-studio.module.css";

export default function VisualTaste() {
  const state = useCampaign();
  const id: ShowcaseId = "visual-taste";
  return <StudioShell id={id} state={state}><div className={styles.layoutVisualTaste}>
    <section className={styles.journalLead} aria-label="Editorial creative"><PageTitle detail="An editorial for the way we listen">Carry the feeling.</PageTitle><VariantPicker state={state} /><CampaignPreview state={state} /><Forecast state={state} inline /></section>
    <aside className={styles.journalSide}><BriefField state={state} /><CampaignControls state={state} /><CampaignActions state={state} /><div className={styles.journalData}><RecentCampaigns state={state} /></div></aside>
  </div></StudioShell>;
}
