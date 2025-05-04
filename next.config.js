const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "src/styles")],
  },
  images: {
    domains: [],
  },
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === "production",
  },
  async redirects() {
    return [
      // Add your old routes here
      // Example format:
      {
        source: "/portfolio",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
