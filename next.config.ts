import type { NextConfig } from "next";

const repository = process.env.GITHUB_REPOSITORY?.split("/")[1];
const pagesBase =
  process.env.GITHUB_PAGES === "true" && repository && !repository.endsWith(".github.io")
    ? `/${repository}`
    : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  ...(pagesBase ? { basePath: pagesBase, assetPrefix: pagesBase } : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: pagesBase,
  },
  experimental: {
    staticGenerationMinPagesPerWorker: 100,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
