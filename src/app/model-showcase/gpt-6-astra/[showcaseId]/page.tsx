import { notFound } from "next/navigation";
import { astraShowcases, astraShowcaseIds, isAstraShowcaseId } from "@/components/model-showcases/gpt-6-astra";
export const dynamicParams = false;
export function generateStaticParams() { return astraShowcaseIds.map(showcaseId => ({showcaseId})); }
export async function generateMetadata({params}: {params: Promise<{showcaseId:string}>}) {
  const {showcaseId}=await params;
  if (!isAstraShowcaseId(showcaseId)) return {title:"Muse Showcase"};
  return {title:`GPT 6 Astra · ${astraShowcases[showcaseId].title} · Muse`,alternates:{canonical:`/model-showcase/gpt-6-astra/${showcaseId}`}};
}
export default async function Page({params}: {params: Promise<{showcaseId:string}>}) {
  const {showcaseId}=await params;
  if (!isAstraShowcaseId(showcaseId)) notFound();
  const Showcase=astraShowcases[showcaseId].component;
  return <Showcase/>;
}
