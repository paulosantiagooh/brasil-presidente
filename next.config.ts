import type { NextConfig } from "next";

// O jogo é publicado como site estático. NEXT_PUBLIC_BASE_PATH é o subcaminho do site publicado.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
};

export default nextConfig;
