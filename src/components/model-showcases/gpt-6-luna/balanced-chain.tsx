"use client";

import { BriefField, CampaignActions, CampaignControls, CampaignPreview, Forecast, PageTitle, RecentCampaigns, StudioShell, VariantPicker, useCampaign } from "./campaign-studio";
import type { ShowcaseId } from "./campaign-data";
import styles from "./campaign-studio.module.css";

export default function BalancedChain() {
  const state = useCampaign();
  const id: ShowcaseId = "balanced-chain";
  return <StudioShell id={id} state={state}><div className={styles.layoutBalancedChain}>
    <section className={styles.balancedBrief}><PageTitle detail="One product, one clear promise">Morrow Arc</PageTitle><BriefField state={state} /><CampaignControls state={state} /><CampaignActions state={state} /></section>
    <section className={styles.balancedCanvas} aria-label="Selected campaign direction"><VariantPicker state={state} /><CampaignPreview state={state} /><RecentCampaigns state={state} /></section>
    <aside className={styles.balancedReview}><Forecast state={state} inline /><div className={styles.panel}><h2>Direction notes</h2><p>Keep the product tactile. Let the setting do the talking.</p></div></aside>
  </div></StudioShell>;
}
