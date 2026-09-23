"use client";

import { BriefField, CampaignActions, CampaignControls, CampaignPreview, Forecast, PageTitle, Panel, RecentCampaigns, StudioShell, VariantPicker, useCampaign } from "./campaign-studio";
import type { ShowcaseId } from "./campaign-data";
import styles from "./campaign-studio.module.css";

export default function VisualFrontend() {
  const state = useCampaign();
  const id: ShowcaseId = "visual-frontend";
  return <StudioShell id={id} state={state}><div className={styles.layoutVisualFrontend}>
    <section className={styles.visualCanvas} aria-label="Art-directed campaign canvas">
      <PageTitle detail="Morrow Arc / campaign preview">Sound, in its element.</PageTitle>
      <VariantPicker state={state} />
      <CampaignPreview state={state} />
      <Forecast state={state} inline />
    </section>
    <aside className={styles.visualDock}>
      <Panel title="Campaign brief" detail="01 / Direction" className={styles.campaignControls}><BriefField state={state} /></Panel>
      <Panel title="Audience & placement" className={styles.campaignControls}><CampaignControls state={state} compact /></Panel>
      <CampaignActions state={state} />
      <Panel><RecentCampaigns state={state} /></Panel>
    </aside>
  </div></StudioShell>;
}
