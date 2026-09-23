"use client";
import { Actions, Brief, Controls, Creative, DirectionNote, Metrics, Recent, Section, Shell, Variants, styles, useStudio } from "./studio";
export default function UxProReference() {
  const state = useStudio();
  return <Shell id="ux-pro-reference" state={state}><div className={styles.layoutUx}>
    <aside className={styles.uxSteps}><h1>Build a launch campaign</h1><ol><li>Write the brief</li><li>Set your audience and style</li><li>Generate directions</li><li>Review and export</li></ol><div style={{marginTop:35}}><Recent state={state} /></div></aside>
    <div className={styles.uxForm}><Section title="Step 1 · Describe the launch" className={styles.panel}><Brief state={state} /></Section><Section title="Step 2 · Set the creative conditions" className={styles.panel}><Controls state={state} /></Section><Section title="Step 3 · Compare options" className={styles.panel}><Variants state={state} /></Section><Actions state={state} /></div>
    <aside className={styles.uxReview}><Section title="Review" detail="Selected result" className={styles.panel}><Creative state={state} scene="mint" /></Section><Section title="Expected response" className={styles.panel}><Metrics state={state} /></Section><DirectionNote state={state} /></aside>
  </div></Shell>;
}
