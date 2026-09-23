"use client";

import { BriefField, CampaignActions, CampaignControls, CampaignPreview, Forecast, PageTitle, Panel, RecentCampaigns, StudioShell, VariantPicker, useCampaign } from "./campaign-studio";
import type { ShowcaseId } from "./campaign-data";
import styles from "./campaign-studio.module.css";

export default function ProductPolishChain() {
  const state = useCampaign();
  const id: ShowcaseId = "product-polish-chain";
  return <StudioShell id={id} state={state}><div className={styles.layoutProductPolish}>
    <section className={styles.polishForm}><Panel title="Campaign brief" detail="Required"><BriefField state={state} /></Panel><Panel title="Audience & voice"><CampaignControls state={state} compact /></Panel><CampaignActions state={state} /></section>
    <section className={styles.polishPreview} aria-label="Campaign preview"><PageTitle detail="Asset preview / Morrow Arc">Campaign creative</PageTitle><VariantPicker state={state} /><CampaignPreview state={state} /></section>
    <aside className={styles.polishSide}><Panel title="Projected performance"><Forecast state={state} /></Panel><Panel title="Recently opened"><RecentCampaigns state={state} /></Panel></aside>
  </div></StudioShell>;
}
