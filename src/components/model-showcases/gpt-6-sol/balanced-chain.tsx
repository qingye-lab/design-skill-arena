"use client";
import { Actions, Brief, Controls, Creative, DirectionNote, Metrics, Recent, Section, Shell, Variants, styles, useStudio } from "./studio";
export default function BalancedChain() {
  const state = useStudio();
  return <Shell id="balanced-chain" state={state}><div className={styles.layoutBalanced}>
    <div className={styles.balancedIntro}><h1>Launch Luma One</h1><Actions state={state} /></div>
    <aside className={styles.balancedLeft}><Section title="Brief" className={styles.panel}><Brief state={state} /></Section><Section title="Audience and style" className={styles.panel}><Controls state={state} /></Section></aside>
    <div className={styles.balancedCenter}><Creative state={state} scene="night" /><Variants state={state} /><DirectionNote state={state} /></div>
    <aside className={styles.balancedRight}><Section title="Forecast" className={styles.panel}><Metrics state={state} /></Section><div className={styles.panel}><Recent state={state} /></div></aside>
  </div></Shell>;
}
