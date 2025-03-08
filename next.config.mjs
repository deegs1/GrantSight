/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  
  // Enable detailed API error stacks in development
  webpack: (config, { dev, isServer }) => {
    if (dev && isServer) {
      // Enable full error stacks for API routes
      config.optimization.minimize = false;
    }
    return config;
  },
};

export default nextConfig; 