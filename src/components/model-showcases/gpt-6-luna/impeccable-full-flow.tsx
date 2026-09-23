"use client";

import { BriefField, CampaignActions, CampaignControls, CampaignPreview, Forecast, PageTitle, Panel, RecentCampaigns, StudioShell, VariantPicker, useCampaign } from "./campaign-studio";
import type { ShowcaseId } from "./campaign-data";
import styles from "./campaign-studio.module.css";

export default function ImpeccableFullFlow() {
  const state = useCampaign();
  const id: ShowcaseId = "impeccable-full-flow";
  return <StudioShell id={id} state={state}><div className={styles.layoutImpeccableFlow}>
    <div className={styles.flowIntro}><PageTitle detail="A considered launch, from first thought to final frame">Make the brief the beginning.</PageTitle><CampaignActions state={state} /></div>
    <aside className={styles.flowAside}>
      <ol className={styles.flowSteps} aria-label="Campaign steps"><li aria-current="step">Set the intent</li><li>Shape the audience</li><li>Choose a direction</li></ol>
      <Panel title="Launch intent"><BriefField state={state} /></Panel>
      <Panel title="Audience & expression"><CampaignControls state={state} compact /></Panel>
    </aside>
    <section className={styles.flowStage} aria-label="Live campaign direction">
      <VariantPicker state={state} />
      <CampaignPreview state={state} />
      <div className={styles.flowBottom}><Forecast state={state} inline /><RecentCampaigns state={state} /></div>
    </section>
  </div></StudioShell>;
}
