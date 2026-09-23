"use client";

import { BriefField, CampaignActions, CampaignControls, CampaignPreview, Forecast, PageTitle, RecentCampaigns, StudioShell, VariantPicker, useCampaign } from "./campaign-studio";
import type { ShowcaseId } from "./campaign-data";
import styles from "./campaign-studio.module.css";

export default function DesignImpeccable() {
  const state = useCampaign();
  const id: ShowcaseId = "design-impeccable";
  return <StudioShell id={id} state={state}><div className={styles.layoutDesignImpeccable}>
    <section className={styles.archiveCanvas}><PageTitle detail="Morrow / product story / proof 01">Sound that finds a place.</PageTitle><VariantPicker state={state} /><CampaignPreview state={state} /><Forecast state={state} inline /></section>
    <aside className={styles.archiveInspector}><BriefField state={state} /><CampaignControls state={state} compact /><CampaignActions state={state} /><RecentCampaigns state={state} /></aside>
  </div></StudioShell>;
}
