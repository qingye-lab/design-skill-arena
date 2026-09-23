"use client";

import { BriefField, CampaignActions, CampaignControls, CampaignPreview, Forecast, PageTitle, Panel, RecentCampaigns, StudioShell, VariantPicker, useCampaign } from "./campaign-studio";
import type { ShowcaseId } from "./campaign-data";
import styles from "./campaign-studio.module.css";

export default function ComponentSystem() {
  const state = useCampaign();
  const id: ShowcaseId = "component-system";
  return <StudioShell id={id} state={state}><div className={styles.layoutComponentSystem}>
    <nav className={styles.componentIndex} aria-label="Workbench sections"><h2>Workbench</h2><span aria-current="page">Overview</span><span>Content</span><span>Audience</span><span>Output</span></nav>
    <div className={styles.componentMain}>
      <PageTitle detail="A live preview built from a consistent creative kit">Campaign system</PageTitle>
      <div className={styles.componentTop}>
        <section aria-label="Campaign preview"><VariantPicker state={state} /><CampaignPreview state={state} /></section>
        <Panel title="Campaign inspector" className={styles.componentInspector}><BriefField state={state} /><CampaignControls state={state} compact /><CampaignActions state={state} /></Panel>
      </div>
      <div className={styles.tokenStrip} aria-label="Creative token samples"><span><i /> Accent</span><span>Headline · Display</span><span>Canvas · 4:3</span><span>Touch · 44 px</span></div>
      <div className={styles.componentTop}><Panel><Forecast state={state} inline /></Panel><Panel><RecentCampaigns state={state} /></Panel></div>
    </div>
  </div></StudioShell>;
}
