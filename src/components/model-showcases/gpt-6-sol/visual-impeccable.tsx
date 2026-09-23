"use client";
import { Actions, Brief, Controls, Creative, Metrics, Recent, Section, Shell, Variants, styles, useStudio } from "./studio";
export default function VisualImpeccable() {
  const state = useStudio();
  return <Shell id="visual-impeccable" state={state}><div className={styles.layoutVisualImp}>
    <div className={styles.visualImpStage}><Creative state={state} scene="night" format="wide" /></div>
    <aside className={styles.visualImpAside}><Section title="Select a story" className={styles.panel}><Variants state={state} /></Section><Section title="Direct the launch" className={styles.panel}><Brief state={state} /><div style={{height:16}} /><Controls state={state} /></Section><Section title="Projected response" className={styles.panel}><Metrics state={state} /></Section><Actions state={state} /><div className={styles.panel}><Recent state={state} /></div></aside>
  </div></Shell>;
}
