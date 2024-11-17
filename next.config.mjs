/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/dates', '@mantine/form', '@mantine/hooks']
  }
};

export default nextConfig;
