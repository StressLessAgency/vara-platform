import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Silence Next dev indicator badge during screenshot capture.
  devIndicators: { position: "bottom-right", appIsrStatus: false } as never,
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
