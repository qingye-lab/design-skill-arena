"use client";

import { BriefField, CampaignActions, CampaignControls, CampaignPreview, Forecast, PageTitle, RecentCampaigns, StudioShell, VariantPicker, useCampaign } from "./campaign-studio";
import type { ShowcaseId } from "./campaign-data";
import styles from "./campaign-studio.module.css";

export default function VisualPremiumChain() {
  const state = useCampaign();
  const id: ShowcaseId = "visual-premium-chain";
  return <StudioShell id={id} state={state}><div className={styles.layoutVisualPremium}>
    <section className={styles.premiumCanvas} aria-label="Premium campaign artwork"><PageTitle detail="An invitation to take the long way">Sound, carried.</PageTitle><CampaignPreview state={state} /><VariantPicker state={state} /><Forecast state={state} inline /></section>
    <aside className={styles.premiumTools}><BriefField state={state} /><CampaignControls state={state} compact /><CampaignActions state={state} /><RecentCampaigns state={state} /></aside>
  </div></StudioShell>;
}
