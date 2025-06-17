import { SimpleGrid, Stack, Text } from '@mantine/core';
import { IconBolt, IconBrandNextjs } from '@tabler/icons-react';
import { BrandIconDrizzle } from '~/components/icons/BrandIconDrizzle';
import { BrandIconMantine } from '~/components/icons/BrandIconMantine';
import { BrandIconTRPC } from '~/components/icons/BrandIconTRPC';
import { FeatureCard } from './FeatureCard';
import { GetStarted } from './GetStarted';

export default function Page() {
  return (
    <>
      <Stack align="center">
        <Text variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} ta="center" fw="bold" fz={24}>
          Full-stack, type-safe, done right—with style.
        </Text>
        <Text ta="center" my="md">
          Mantine Next is an opinionated template for building
          <br />
          full-stack web applications with Mantine, Next.js, tRPC and Drizzle.
        </Text>
      </Stack>
      <SimpleGrid mt="xl" spacing="xl" maw={800} mx="auto" cols={{ base: 1, xs: 2 }}>
        <FeatureCard title="Next.js" icon={IconBrandNextjs}>
          <div>Next.js is the de-facto metaframework for building React web applications.</div>
          <div>
            Performant and SEO-friendly out-of-the-box, with SSR, server components and actions, great developer
            experience, a great community and a constantly-growing ecosystem—you can&apos;t go wrong with it.
          </div>
        </FeatureCard>
        <FeatureCard title="Mantine" icon={BrandIconMantine}>
          <div>
            Tailwind and shadcn are cool, but if you&apos;re building a highly interactive application, Mantine is
            offering better, fully-functional input components out of the box.
          </div>
          <div>
            Keep code clutter to a minimum and focus on functionality instead of trying to make sense of thousands of
            class names.
          </div>
        </FeatureCard>
        <FeatureCard title="tRPC" icon={BrandIconTRPC}>
          <div>
            Full-stack type safety is a must and tRPC is the leading solution allowing you to move fast and break
            nothing.
          </div>
          <div>
            Validation, authentication, authorization, request batching—everything playing nicely with TanStack Query.
          </div>
        </FeatureCard>
        <FeatureCard title="Drizzle" icon={BrandIconDrizzle}>
          <div>
            Drizzle is a simple and performant ORM that allows you to interact with your database in a type-safe manner,
            while also giving you the ability to dynamically build complex queries when needed.
          </div>
          <div>Focus on data, not database technicalities.</div>
        </FeatureCard>
      </SimpleGrid>
      <Stack align="center" mt={60} mb="xl">
        <IconBolt size={24} />
        <Text>Ready to get started?</Text>
        <GetStarted />
      </Stack>
    </>
  );
}
