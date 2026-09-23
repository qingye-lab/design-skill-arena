import { notFound } from "next/navigation";

import {
  MODEL_NAME,
  MODEL_SLUG,
  isShowcaseId,
  showcaseComponents,
  showcaseIds,
  showcaseDefinitions,
} from "@/components/model-showcases/gpt-6-luna";

export const dynamicParams = false;

export function generateStaticParams() {
  return showcaseIds.map((showcaseId) => ({ showcaseId }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ showcaseId: string }>;
}) {
  const { showcaseId } = await params;

  if (isShowcaseId(showcaseId)) {
    return {
      title: `${MODEL_NAME} ${showcaseDefinitions[showcaseId].title} | Muse Showcase`,
      description: `${MODEL_NAME} campaign workbench using ${showcaseDefinitions[showcaseId].skills}.`,
      alternates: { canonical: `/model-showcase/${MODEL_SLUG}/${showcaseId}` },
    };
  }

  return { title: "Muse Showcase" };
}

export default async function Page({
  params,
}: {
  params: Promise<{ showcaseId: string }>;
}) {
  const { showcaseId } = await params;

  if (!isShowcaseId(showcaseId)) notFound();

  const Showcase = showcaseComponents[showcaseId];
  return <Showcase />;
}
