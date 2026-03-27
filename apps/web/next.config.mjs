/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: false
  },
  transpilePackages: ["@ainspire/api-client", "@ainspire/types"]
};

export default nextConfig;
