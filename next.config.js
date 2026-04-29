/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" }
    ]
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // Avoid unstable filesystem cache writes on this environment (EPERM/ENOENT),
      // which can corrupt dev chunks and trigger random 500 errors.
      config.cache = false;
    }
    return config;
  }
};

module.exports = nextConfig;

