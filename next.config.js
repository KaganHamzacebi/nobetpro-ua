module.exports = {
  webpack: config => {
    return config;
  },
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true
  },
  experimental: {
    authInterrupts: true,
    optimizePackageImports: ['@mantine/core', '@mantine/dates', '@mantine/form', '@mantine/hooks']
  }
};
