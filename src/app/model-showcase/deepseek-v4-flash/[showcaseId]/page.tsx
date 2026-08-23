import { notFound } from "next/navigation"

import {
  MODEL_NAME,
  isDeepseekV4FlashShowcaseId,
  showcaseComponents,
  showcaseIds,
  showcaseTitles,
} from "@/components/model-showcases/deepseek-v4-flash"

export const dynamicParams = false

export function generateStaticParams() {
  return showcaseIds.map((showcaseId) => ({
    showcaseId,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ showcaseId: string }>
}) {
  const { showcaseId } = await params

  if (isDeepseekV4FlashShowcaseId(showcaseId)) {
    return {
      title: `${MODEL_NAME} ${showcaseTitles[showcaseId]} | Muse Showcase`,
    }
  }

  return {
    title: "Muse Showcase",
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ showcaseId: string }>
}) {
  const { showcaseId } = await params

  if (isDeepseekV4FlashShowcaseId(showcaseId)) {
    const Showcase = showcaseComponents[showcaseId]
    return <Showcase />
  }

  notFound()
}
