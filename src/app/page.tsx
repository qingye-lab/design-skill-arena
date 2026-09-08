import { HomePage } from "@/components/arena/home-page"
import { getPublicArenaSkills } from "@/lib/public-arena-skills"
import { showcases } from "@/data/showcases"

const siteUrl = "https://arena.xflux.cn"

export default function Page() {
  const models = Array.from(new Set(showcases.map((item) => item.model)))
  const chains = Array.from(new Set(showcases.map((item) => item.skillChainLabel)))

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Design Skill Arena",
    url: siteUrl,
    inLanguage: ["zh-CN", "en-US"],
    description:
      "A bilingual static gallery of AI frontend design skill outputs for Muse AI Campaign Studio.",
    about: [
      "AI frontend design",
      "frontend design skills",
      "Muse AI Campaign Studio",
      "generated UI showcase",
      "前端设计技能",
      "AI 页面生成展示",
    ],
    creator: {
      "@type": "Person",
      name: "liyanqing90",
    },
    hasPart: showcases.slice(0, 72).map((item) => ({
      "@type": "CreativeWork",
      name: `${item.model} ${item.title}`,
      url: `${siteUrl}${item.demoUrl}`,
      description: `${item.title} generated with ${item.skillChainLabel}.`,
      keywords: [item.model, ...item.skills, item.skillChainLabel],
    })),
    mentions: [...models, ...chains],
  }

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomePage sources={getPublicArenaSkills()} />
    </>
  )
}
