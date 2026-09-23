"use client";
import { Actions, Brief, Controls, Creative, DirectionNote, Metrics, Recent, Section, Shell, Variants, styles, useStudio } from "./studio";
export default function StandardBuilder() {
  const state = useStudio();
  return <Shell id="standard-builder" state={state}><div className={styles.layoutStandard}>
    <aside className={styles.standardLeft}><Section title="Campaign setup" detail="01 / Input" className={styles.panel}><Brief state={state} /></Section><Section title="Creative controls" className={styles.panel}><Controls state={state} /></Section><Actions state={state} /></aside>
    <div className={styles.standardCenter}><Section title="Concept preview" detail="Live direction"><Creative state={state} scene="mint" /></Section><Variants state={state} /><DirectionNote state={state} /></div>
    <aside className={styles.standardRight}><Section title="Forecast" className={styles.panel}><Metrics state={state} /></Section><div className={styles.panel}><Recent state={state} /></div></aside>
  </div></Shell>;
}
