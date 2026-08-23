import type { NextConfig } from "next";

const isStaticExport = process.env.NEXT_OUTPUT === "export";
const isScreenshotBuild = process.env.NEXT_SCREENSHOT_BUILD === "1";
const assetBaseUrl = process.env.NEXT_PUBLIC_ASSET_BASE_URL;
const assetUrl = assetBaseUrl ? new URL(assetBaseUrl) : null;

const nextConfig: NextConfig = {
  output: isStaticExport ? "export" : undefined,
  trailingSlash: isStaticExport,
  experimental: isScreenshotBuild
    ? {
        cpus: 1,
        staticGenerationMaxConcurrency: 1,
        staticGenerationMinPagesPerWorker: 1000,
      }
    : undefined,
  images: {
    unoptimized: true,
    remotePatterns: assetUrl
      ? [
          {
            protocol: assetUrl.protocol.replace(":", "") as "http" | "https",
            hostname: assetUrl.hostname,
            port: assetUrl.port,
            pathname: "/**",
          },
        ]
      : [],
  },
};

export default nextConfig;
