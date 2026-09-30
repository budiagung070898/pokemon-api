import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/PokeAPI/sprites/**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/pokemon", destination: "/pokedex", permanent: true },
      { source: "/pokemon/:name", destination: "/pokedex/:name", permanent: true },
    ];
  },
};

export default nextConfig;
