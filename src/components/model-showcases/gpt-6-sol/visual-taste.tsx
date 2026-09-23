"use client";
import { Actions, Brief, Controls, Creative, DirectionNote, Metrics, Recent, Section, Shell, Variants, styles, useStudio } from "./studio";
export default function VisualTaste() {
  const state = useStudio();
  return <Shell id="visual-taste" state={state}><div className={styles.layoutVisualTaste}>
    <div className={styles.visualTasteStage}><Creative state={state} scene="mint" format="wide" /></div>
    <aside className={styles.visualTasteAside}><Section title="A quieter launch" className={styles.panel}><DirectionNote state={state} /></Section><Section title="Directions" className={styles.panel}><Variants state={state} /></Section><Section title="Brief" className={styles.panel}><Brief state={state} /></Section><Section title="Edit context" className={styles.panel}><Controls state={state} /></Section><Actions state={state} /><Metrics state={state} /><Recent state={state} /></aside>
  </div></Shell>;
}
