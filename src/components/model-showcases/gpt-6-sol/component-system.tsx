"use client";
import { Brief, Controls, Creative, DirectionNote, Metrics, Recent, Section, Shell, SystemActions, Variants, styles, useStudio } from "./studio";
export default function ComponentSystem() {
  const state = useStudio();
  return <Shell id="component-system" state={state}><div className={styles.layoutComponents}>
    <aside className={styles.componentNav}><h1>Muse / Patterns</h1><a className={styles.navActive} href="#system-inputs">Campaign builder</a><a href="#system-inputs">Input controls</a><a href="#system-directions">Direction states</a><a href="#system-results">Forecast metrics</a><a href="#system-saved">Saved work</a><div id="system-saved" style={{marginTop:35}}><Recent state={state} /></div></aside>
    <div className={styles.componentMain}><div className={styles.componentTop}><Section id="system-inputs" title="01 · Inputs" className={styles.panel}><Brief state={state} /><div style={{height:18}} /><Controls state={state} /></Section><Section title="02 · Live preview" className={styles.panel}><Creative state={state} scene="mint" /></Section></div><div className={styles.componentBottom}><Section id="system-directions" title="Direction variants" className={styles.panel}><Variants state={state} /><div style={{height:16}} /><DirectionNote state={state} /></Section><Section id="system-results" title="Actions and results" className={styles.panel}><SystemActions state={state} /><div style={{height:23}} /><Metrics state={state} /></Section></div><div className={styles.tokenRow}><span>System tokens / Canvas · Ink · Accent</span><i aria-hidden="true" /></div></div>
  </div></Shell>;
}
