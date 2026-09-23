"use client";
import { Brief, Controls, Creative, DirectionNote, Metrics, Recent, Section, Shell, SystemActions, Variants, styles, useStudio } from "./studio";
export default function ProductPolishChain() {
  const state = useStudio();
  return <Shell id="product-polish-chain" state={state}><div className={styles.layoutPolish}>
    <aside className={styles.polishNav}><h1>Muse / Studio</h1><a className={styles.navActive} href="#polish-campaign">Campaigns</a><a href="#polish-preview">Creative library</a><a href="#polish-settings">Audience sets</a><button type="button" onClick={state.exportCampaign}>Exports</button></aside>
    <div className={styles.polishContent}><div id="polish-campaign" className={styles.polishHead}><h2>Luma One campaign</h2><SystemActions state={state} /></div><div className={styles.polishGrid}>
      <div className={styles.polishLeft}><Section title="Brief" className={styles.panel}><Brief state={state} /></Section><Section id="polish-settings" title="Settings" className={styles.panel}><Controls state={state} /></Section></div>
      <div className={styles.polishMid}><Section id="polish-preview" title="Preview" detail="Live creative"><Creative state={state} scene="mint" /></Section><Variants state={state} /></div>
      <div className={styles.polishRight}><Section title="Insights" className={styles.panel}><Metrics state={state} /></Section><DirectionNote state={state} /><div className={styles.panel}><Recent state={state} /></div></div>
    </div></div>
  </div></Shell>;
}
