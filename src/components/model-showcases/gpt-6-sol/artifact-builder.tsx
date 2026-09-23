"use client";
import { Actions, Brief, Controls, Creative, Metrics, Recent, Section, Shell, Variants, styles, useStudio } from "./studio";
export default function ArtifactBuilder() {
  const state = useStudio();
  return <Shell id="artifact-builder" state={state}><div className={styles.layoutArtifact}>
    <aside className={styles.artifactFiles}><h1>muse / workspace</h1><a className={styles.activeFile} href="#artifact-brief">▸ launch.brief</a><a href="#artifact-config">▸ audiences.json</a><a href="#artifact-directions">▸ directions / A B C</a><a href="#artifact-metrics">▸ forecast.sim</a><button type="button" onClick={state.exportCampaign}>▸ exports /</button><div style={{marginTop:35}}><Recent state={state} /></div></aside>
    <div className={styles.artifactEditor}><Section id="artifact-brief" title="launch.brief"><Brief state={state} /></Section><Section id="artifact-config" title="config.json"><Controls state={state} /></Section><Actions state={state} /></div>
    <div className={styles.artifactOutput}><Section title="render / campaign-preview"><Creative state={state} scene="blue" /></Section><Section id="artifact-directions" title="build variants"><Variants state={state} /></Section><Section id="artifact-metrics" title="simulate.metrics"><Metrics state={state} /></Section></div>
  </div></Shell>;
}
