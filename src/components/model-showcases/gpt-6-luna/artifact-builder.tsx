"use client";

import { BriefField, CampaignActions, CampaignControls, CampaignPreview, Forecast, PageTitle, RecentCampaigns, StudioShell, VariantPicker, useCampaign } from "./campaign-studio";
import type { ShowcaseId } from "./campaign-data";
import styles from "./campaign-studio.module.css";

export default function ArtifactBuilder() {
  const state = useCampaign();
  const id: ShowcaseId = "artifact-builder";
  return <StudioShell id={id} state={state}><div className={styles.layoutArtifactBuilder}>
    <nav className={styles.artifactRail} aria-label="Campaign files"><h2>PROJECT</h2><span className={styles.artifactFile} aria-current="page">brief.md</span><span className={styles.artifactFile}>audience.json</span><span className={styles.artifactFile}>variants / 03</span><span className={styles.artifactFile}>forecast.csv</span></nav>
    <section className={styles.artifactCanvas} aria-label="Campaign artifact preview">
      <PageTitle detail="Morrow Arc / release package">Campaign / coast</PageTitle>
      <VariantPicker state={state} />
      <CampaignPreview state={state} />
      <Forecast state={state} inline />
    </section>
    <aside className={styles.artifactInspector}>
      <h2>INSPECTOR</h2>
      <BriefField state={state} />
      <CampaignControls state={state} compact />
      <CampaignActions state={state} />
      <RecentCampaigns state={state} />
    </aside>
  </div></StudioShell>;
}
