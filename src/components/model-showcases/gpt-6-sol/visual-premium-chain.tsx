"use client";
import { Actions, Brief, Controls, Creative, DirectionNote, Metrics, Recent, Section, Shell, Variants, styles, useStudio } from "./studio";
export default function VisualPremiumChain() {
  const state = useStudio();
  return <Shell id="visual-premium-chain" state={state}><div className={styles.layoutPremium}>
    <div className={styles.premiumStage}><Creative state={state} scene="stone" format="wide" /></div>
    <aside className={styles.premiumAside}><Section title="The story" className={styles.panel}><DirectionNote state={state} /><div style={{height:16}} /><Variants state={state} /></Section><Section title="Campaign brief" className={styles.panel}><Brief state={state} /></Section><Section title="Art direction" className={styles.panel}><Controls state={state} /></Section><Actions state={state} /><Section title="Forecast" className={styles.panel}><Metrics state={state} /></Section><Recent state={state} /></aside>
  </div></Shell>;
}
