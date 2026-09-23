"use client";
import { Actions, Brief, Controls, Creative, Metrics, Recent, Section, Shell, Variants, styles, useStudio } from "./studio";
export default function VisualFrontend() {
  const state = useStudio();
  return <Shell id="visual-frontend" state={state}><div className={styles.layoutPoster}>
    <div className={styles.posterStage}><Creative state={state} scene="blue" format="wide" /></div>
    <aside className={styles.posterTools}><Section title="Choose the frame"><Variants state={state} /></Section><Section title="Make the campaign" className={styles.panel}><Brief state={state} /><div style={{height:16}} /><Controls state={state} /></Section><Actions state={state} /><Section title="Projected response" className={styles.panel}><Metrics state={state} /></Section><Recent state={state} /></aside>
  </div></Shell>;
}
