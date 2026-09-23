"use client";
import { Actions, Brief, Controls, Creative, DirectionNote, Metrics, Recent, Section, Shell, Variants, styles, useStudio } from "./studio";
export default function StandardImpeccable() {
  const state = useStudio();
  return <Shell id="standard-impeccable" state={state}><div className={styles.layoutStdImp}>
    <div className={styles.stdImpTop}><h1>Campaign workspace</h1><Actions state={state} /></div>
    <aside className={styles.stdImpAside}><Section title="Brief" className={styles.panel}><Brief state={state} /></Section><Section title="Creative settings" className={styles.panel}><Controls state={state} /></Section></aside>
    <div className={styles.stdImpMain}><Creative state={state} scene="blue" /><Section title="Alternatives" detail="Review all three"><Variants state={state} /></Section></div>
    <div className={styles.stdImpFooter}><DirectionNote state={state} /><div><Metrics state={state} /><div style={{height:18}} /><Recent state={state} /></div></div>
  </div></Shell>;
}
