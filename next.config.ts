import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Item artwork hosts referenced by src/data/heritage_dofus_loterie.json
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vertylo.github.io",
        pathname: "/wakassets/items/**",
      },
      {
        protocol: "https",
        hostname: "methodwakfu.com",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
