/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "raw.githubusercontent.com", // ✅ whitelist PokeAPI artwork
    ],
  },
};

module.exports = nextConfig;
