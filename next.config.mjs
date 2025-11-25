/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.NEXT_BUILD_FOR_ELECTRON === '1' ? 'standalone' : undefined,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.target = 'web';
    }
    return config;
  },
};

export default nextConfig;
