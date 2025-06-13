import type { NextConfig } from 'next';

export default {
  output: 'standalone',
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/dates', '@mantine/form', '@mantine/hooks', '@mantine/modals'],
  },
} satisfies NextConfig;
