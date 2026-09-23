"use client";

import { BriefField, CampaignActions, CampaignControls, CampaignPreview, Forecast, PageTitle, RecentCampaigns, StudioShell, VariantPicker, useCampaign } from "./campaign-studio";
import type { ShowcaseId } from "./campaign-data";
import styles from "./campaign-studio.module.css";

export default function StandardTaste() {
  const state = useCampaign();
  const id: ShowcaseId = "standard-taste";
  return <StudioShell id={id} state={state}><div className={styles.layoutStandardTaste}>
    <section className={styles.tasteStory}><PageTitle detail="Morrow Arc / campaign note">A sound of your own.</PageTitle><BriefField state={state} /><CampaignControls state={state} /><CampaignActions state={state} /></section>
    <section className={styles.tasteCanvas} aria-label="Editorial campaign canvas"><VariantPicker state={state} /><CampaignPreview state={state} /><Forecast state={state} inline /><RecentCampaigns state={state} /></section>
  </div></StudioShell>;
}
