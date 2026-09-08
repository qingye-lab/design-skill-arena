import type { Metadata } from "next"
import { MethodologyPage } from "@/components/arena/methodology-page"

export const metadata: Metadata = {
  title: "项目简报 · The shared brief",
  description: "Muse 共同任务、模型与技能组合、作品观察方式及当前记录边界。",
  alternates: { canonical: "/methodology/", languages: { "zh-CN": "/methodology/", "en-US": "/methodology/?lang=en" } },
}

export default function Page() { return <MethodologyPage /> }
