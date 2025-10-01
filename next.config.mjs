// selfscape-frontend-v2/next.config.mjs
/** @type {import('next').NextConfig} */
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
let supabaseHost;
try {
  supabaseHost = new URL(SUPABASE_URL).hostname;
} catch {
  supabaseHost = undefined;
}

const nextConfig = {
  reactStrictMode: true,
  experimental: { optimizePackageImports: [] },

  images: {
    remotePatterns: [
      // Dynamic, from your env (preferred)
      ...(supabaseHost
        ? [
            {
              protocol: "https",
              hostname: supabaseHost,
              port: "",
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),

      // Hardcoded safety net for your current project ref
      {
        protocol: "https",
        hostname: "oodezcvriugywonuvvoo.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },

      // If you still show any backend-hosted images:
      {
        protocol: "https",
        hostname: "selfscape-backend.onrender.com",
        port: "",
        pathname: "/static/**",
      },
    ],
  },
};

export default nextConfig;
