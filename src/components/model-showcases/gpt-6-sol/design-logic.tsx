"use client";
import { Actions, Brief, Controls, Creative, DirectionNote, Metrics, Recent, Section, Shell, Variants, styles, useStudio } from "./studio";
export default function DesignLogic() {
  const state = useStudio();
  return <Shell id="design-logic" state={state}><div className={styles.layoutLogic}>
    <div className={styles.logicIndex}>M.</div>
    <aside className={styles.logicForm}><Section title="Define the assignment" detail="Input"><Brief state={state} /></Section><Section title="Set the conditions"><Controls state={state} /></Section><Actions state={state} /><Recent state={state} /></aside>
    <div className={styles.logicMain}><Section title="01 / Select a direction"><Variants state={state} /></Section><Creative state={state} scene="mint" /><div className={styles.designUxBar}><DirectionNote state={state} /><Metrics state={state} /></div></div>
  </div></Shell>;
}
