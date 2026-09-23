"use client";
import { Actions, Brief, Controls, Creative, DirectionNote, Metrics, Recent, Section, Shell, Variants, styles, useStudio } from "./studio";
export default function DesignUxPro() {
  const state = useStudio();
  return <Shell id="design-ux-pro" state={state}><div className={styles.layoutDesignUx}>
    <aside className={styles.designUxLeft}><h1>Plan → Create<br />→ Review</h1><Section title="1 · Brief"><Brief state={state} /></Section><Section title="2 · Parameters"><Controls state={state} /></Section><Actions state={state} /><Recent state={state} /></aside>
    <div className={styles.designUxRight}><Section title="3 · Compare directions" detail="Select one before export"><Variants state={state} /></Section><Creative state={state} scene="blue" /><div className={styles.designUxBar}><Section title="Decision rationale"><DirectionNote state={state} /></Section><Section title="Simulated outcome"><Metrics state={state} /></Section></div></div>
  </div></Shell>;
}
