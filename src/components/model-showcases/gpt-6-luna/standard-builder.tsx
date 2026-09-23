"use client";

import { BriefField, CampaignActions, CampaignControls, CampaignPreview, Forecast, PageTitle, Panel, RecentCampaigns, StudioShell, VariantPicker, useCampaign } from "./campaign-studio";
import type { ShowcaseId } from "./campaign-data";
import styles from "./campaign-studio.module.css";

export default function StandardBuilder() {
  const state = useCampaign();
  const id: ShowcaseId = "standard-builder";
  return <StudioShell id={id} state={state}><div className={styles.layoutStandardBuilder}>
    <div className={styles.standardForm}>
      <PageTitle>Campaign setup</PageTitle>
      <Panel title="Creative brief"><BriefField state={state} /></Panel>
      <Panel title="Creative controls"><CampaignControls state={state} /></Panel>
      <CampaignActions state={state} />
    </div>
    <section className={styles.standardPreview} aria-label="Campaign preview">
      <Panel title="Live direction" detail="Morrow Arc / launch">
        <VariantPicker state={state} />
        <CampaignPreview state={state} />
      </Panel>
    </section>
    <aside className={styles.standardInsight}>
      <Panel><Forecast state={state} /></Panel>
      <Panel><RecentCampaigns state={state} /></Panel>
    </aside>
  </div></StudioShell>;
}
