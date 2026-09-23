"use client";

import { BriefField, CampaignActions, CampaignControls, CampaignPreview, Forecast, PageTitle, RecentCampaigns, StudioShell, VariantPicker, useCampaign } from "./campaign-studio";
import type { ShowcaseId } from "./campaign-data";
import styles from "./campaign-studio.module.css";

export default function DesignLogic() {
  const state = useCampaign();
  const id: ShowcaseId = "design-logic";
  return <StudioShell id={id} state={state}><div className={styles.layoutDesignLogic}>
    <div className={styles.logicIndex} aria-hidden="true">01</div>
    <section className={styles.logicForm}>
      <PageTitle detail="Define the launch before shaping the story">The campaign brief</PageTitle>
      <BriefField state={state} />
      <CampaignControls state={state} />
      <CampaignActions state={state} />
    </section>
    <section className={styles.logicCanvas} aria-label="Campaign logic and live direction">
      <VariantPicker state={state} />
      <CampaignPreview state={state} />
      <div className={styles.logicBottom}>
        <Forecast state={state} inline />
        <RecentCampaigns state={state} />
      </div>
    </section>
  </div></StudioShell>;
}
