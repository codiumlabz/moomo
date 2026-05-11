import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Reduce React prerender headers to avoid HTTP 431 from large Supabase session tokens
  reactMaxHeadersLength: 1000,
  adapterPath: require.resolve("@netlify/next"),
};

export default nextConfig;
