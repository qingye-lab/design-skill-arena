import { notFound } from "next/navigation"

import {
  MODEL_NAME,
  isOxShowcaseId,
  showcaseComponents,
  showcaseIds,
  showcaseTitles,
} from "@/components/model-showcases/ox"

export const dynamicParams = false

export function generateStaticParams() {
  return showcaseIds.map((showcaseId) => ({ showcaseId }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ showcaseId: string }>
}) {
  const { showcaseId } = await params

  if (isOxShowcaseId(showcaseId)) {
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

  if (!isOxShowcaseId(showcaseId)) {
    notFound()
  }

  const Showcase = showcaseComponents[showcaseId]
  return <Showcase />
}
