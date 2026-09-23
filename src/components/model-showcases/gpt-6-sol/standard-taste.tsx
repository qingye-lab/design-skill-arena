"use client";
import { Actions, Brief, Controls, Creative, DirectionNote, Metrics, Recent, Section, Shell, Variants, styles, useStudio } from "./studio";
export default function StandardTaste() {
  const state = useStudio();
  return <Shell id="standard-taste" state={state}><div className={styles.layoutTaste}>
    <div className={styles.tasteMain}><h1>A campaign with room to breathe.</h1><Creative state={state} scene="night" /><Variants state={state} /><DirectionNote state={state} /></div>
    <aside className={styles.tasteAside}><Section title="The brief" className={styles.panel}><Brief state={state} /></Section><Section title="Art direction" className={styles.panel}><Controls state={state} /></Section><Actions state={state} /><Section title="Expected response" className={styles.panel}><Metrics state={state} /></Section><Recent state={state} /></aside>
  </div></Shell>;
}
