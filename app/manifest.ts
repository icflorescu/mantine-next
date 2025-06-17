import type { MetadataRoute } from 'next';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  return {
    name: 'Mantine Next',
    short_name: 'Mantine Next',
    description: 'The easiest way to get started with Mantine, Next.js and tRPC.',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    theme_color: '#ffffff',
    background_color: '#ffffff',
    start_url: 'http://localhost:3000/',
    display: 'standalone',
  };
}
