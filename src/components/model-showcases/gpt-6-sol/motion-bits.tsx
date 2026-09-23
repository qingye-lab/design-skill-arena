"use client";
import { Actions, Brief, Controls, Creative, Metrics, Recent, Section, Shell, Variants, styles, useStudio } from "./studio";
export default function MotionBits() {
  const state = useStudio();
  return <Shell id="motion-bits" state={state}><div className={styles.layoutMotion}>
    <div className={styles.motionTitle}><h1>Give the idea<br />momentum.</h1><span>Campaign motion lab / Luma One</span></div>
    <div className={styles.motionStage}><Creative state={state} scene="blue" /><div className={styles.motionTrack} aria-hidden="true"><i /><i /><i /><i /><i /></div><Variants state={state} /><Actions state={state} /></div>
    <aside className={styles.motionSide}><Section title="Creative input" className={styles.panel}><Brief state={state} /></Section><Section title="Motion context" className={styles.panel}><Controls state={state} /></Section><Section title="Response signal" className={styles.panel}><Metrics state={state} /></Section><div className={styles.panel}><Recent state={state} /></div></aside>
  </div></Shell>;
}
