import { skills } from "@/data/skills"

// Project-local paths and installation state never cross the page's client boundary.
export function getPublicArenaSkills() {
  return skills.map((skill) => ({
    id: skill.id,
    name: skill.name,
    aliases: skill.aliases ?? [],
    type: skill.type === "library" ? "library" as const : skill.type === "guideline" ? "guideline" as const : "skill" as const,
    summary: skill.summary,
    summaryEn: skill.summaryEn ?? skill.summary,
    officialUrl: skill.officialUrl ?? null,
    githubUrl: skill.githubUrl ?? null,
    revision: skill.githubUrl?.match(/\/(?:tree|blob)\/([a-f0-9]{7,40})(?:\/|$)/)?.[1] ?? null,
    historical: skill.notes.some((note) => /并非当前维护版本|官方移除/.test(note)),
  }))
}

export type PublicArenaSkill = ReturnType<typeof getPublicArenaSkills>[number]
