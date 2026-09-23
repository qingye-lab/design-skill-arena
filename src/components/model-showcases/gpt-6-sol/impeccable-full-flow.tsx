"use client";
import { Actions, Brief, Controls, Creative, DirectionNote, Metrics, Recent, Section, Shell, Variants, styles, useStudio } from "./studio";
export default function ImpeccableFullFlow() {
  const state = useStudio();
  return <Shell id="impeccable-full-flow" state={state}><div className={styles.layoutFlow}>
    <div className={styles.flowIntro}><h1>From idea to launch.</h1><Actions state={state} /></div>
    <aside className={styles.flowAside}><Section title="The brief" className={styles.panel}><Brief state={state} /></Section><Section title="Direction settings" className={styles.panel}><Controls state={state} /></Section><div className={styles.panel}><Recent state={state} /></div></aside>
    <div className={styles.flowStage}><Section title="Creative review" detail="Luma One / 2026"><Creative state={state} scene="night" /></Section><div className={styles.flowBottom}><Section title="Compare directions"><Variants state={state} /></Section><Section title="Projected impact"><Metrics state={state} /></Section></div><DirectionNote state={state} /></div>
  </div></Shell>;
}
