"use client";
import { Actions, Brief, Controls, Creative, DirectionNote, Metrics, Recent, Section, Shell, Variants, styles, useStudio } from "./studio";
export default function DesignImpeccable() {
  const state = useStudio();
  return <Shell id="design-impeccable" state={state}><div className={styles.layoutDesignImp}>
    <div className={styles.designImpLabel}>Muse / Creative direction / Luma One</div>
    <div className={styles.designImpMain}><h1>Find the right<br />kind of light.</h1><Creative state={state} scene="mint" /><Variants state={state} /><Metrics state={state} /></div>
    <aside className={styles.designImpAside}><Section title="Campaign note" className={styles.panel}><Brief state={state} /></Section><Section title="Conditions" className={styles.panel}><Controls state={state} /></Section><Actions state={state} /><DirectionNote state={state} /><Recent state={state} /></aside>
  </div></Shell>;
}
