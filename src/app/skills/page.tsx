import type { Metadata } from "next"
import { SkillsPage } from "@/components/arena/skills-page"
import { getPublicArenaSkills } from "@/lib/public-arena-skills"

export const metadata: Metadata = {
  title: "Skills · 设计技能资料",
  description: "了解 Design Skill Arena 中设计技能的用途、公开来源和关联作品。",
  alternates: { canonical: "/skills/", languages: { "zh-CN": "/skills/", "en-US": "/skills/?lang=en" } },
}

export default function Page() { return <SkillsPage sources={getPublicArenaSkills()} /> }
