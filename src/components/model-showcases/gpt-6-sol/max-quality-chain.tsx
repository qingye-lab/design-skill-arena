"use client";
import { Actions, Brief, Controls, Creative, DirectionNote, Metrics, Recent, Section, Shell, Variants, styles, useStudio } from "./studio";
export default function MaxQualityChain() {
  const state = useStudio();
  return <Shell id="max-quality-chain" state={state}><div className={styles.layoutMax}>
    <div className={styles.maxTitle}><h1>Campaign command center</h1><Actions state={state} /></div>
    <aside className={styles.maxCol}><Section title="Launch plan" className={styles.panel}><Brief state={state} /></Section><Section title="Recent activity" className={styles.panel}><Recent state={state} /></Section></aside>
    <div className={styles.maxCol}><Section title="Creative parameters" className={styles.panel}><Controls state={state} /></Section><Section title="Direction selection" className={styles.panel}><Variants state={state} /></Section><Section title="Selected idea" className={styles.panel}><DirectionNote state={state} /></Section></div>
    <div className={`${styles.maxCol} ${styles.maxPreview}`}><Section title="Primary preview" detail="Luma One · Social"><Creative state={state} scene="blue" /></Section></div>
    <aside className={styles.maxCol}><Section title="Forecast" className={styles.panel}><Metrics state={state} /></Section><Section title="Quality checks" className={styles.panel}><ul className={styles.qualityList}><li>Brief captured</li><li>Three directions</li><li>Responsive creative</li><li>Export ready</li></ul></Section></aside>
  </div></Shell>;
}
