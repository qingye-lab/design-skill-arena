import { notFound } from "next/navigation";
import { isShowcaseId, showcaseDetails, showcaseIds, solShowcases } from "@/components/model-showcases/gpt-6-sol";

export const dynamicParams = false;

export function generateStaticParams() {
  return showcaseIds.map((showcaseId) => ({ showcaseId }));
}

export async function generateMetadata({ params }: { params: Promise<{ showcaseId: string }> }) {
  const { showcaseId } = await params;
  if (!isShowcaseId(showcaseId)) return { title: "Muse Campaign Studio" };
  return {
    title: `GPT-6 Sol · ${showcaseDetails[showcaseId].name} · Muse Campaign Studio`,
    description: `Muse AI Campaign Studio by GPT-6 Sol using ${showcaseDetails[showcaseId].skills}.`,
    alternates: { canonical: `/model-showcase/gpt-6-sol/${showcaseId}` },
  };
}

export default async function Page({ params }: { params: Promise<{ showcaseId: string }> }) {
  const { showcaseId } = await params;
  if (!isShowcaseId(showcaseId)) notFound();
  const Showcase = solShowcases[showcaseId];
  return <Showcase />;
}
