import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  
  /* config options here */

  experimental:{
    serverComponentsHmrCache:false
  },
   images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xsvazyumoodjhguwtaup.supabase.co",
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
