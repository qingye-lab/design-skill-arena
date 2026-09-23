"use client";

import { BriefField, CampaignActions, CampaignControls, CampaignPreview, Forecast, PageTitle, Panel, RecentCampaigns, StudioShell, VariantPicker, useCampaign } from "./campaign-studio";
import type { ShowcaseId } from "./campaign-data";
import styles from "./campaign-studio.module.css";

export default function MotionBits() {
  const state = useCampaign();
  const id: ShowcaseId = "motion-bits";
  return <StudioShell id={id} state={state}><div className={styles.layoutMotionBits}>
    <section className={styles.motionStage} aria-label="Animated campaign stage"><PageTitle detail="Direction follows direction">Sound moves with you.</PageTitle><div className={styles.motionTrack} aria-label="Campaign sequence"><span>Brief</span><span>Shape</span><span>Release</span></div><VariantPicker state={state} /><CampaignPreview state={state} /><Forecast state={state} inline /><CampaignActions state={state} /></section>
    <aside className={styles.motionSide}><Panel title="Direction controls"><BriefField state={state} /><CampaignControls state={state} compact /></Panel><Panel><RecentCampaigns state={state} /></Panel></aside>
  </div></StudioShell>;
}
