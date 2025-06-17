import { Card, Group, Stack, Text } from '@mantine/core';
import type { ComponentType, PropsWithChildren } from 'react';
import type { BrandIconProps } from '~/components/icons/BrandIconProps';

export type FeatureCardProps = PropsWithChildren<{
  icon: ComponentType<BrandIconProps>;
  title: string;
}>;

export function FeatureCard({ icon: Icon, title, children }: FeatureCardProps) {
  return (
    <Card withBorder radius="lg" p="md">
      <Stack gap="sm">
        <Group>
          <Icon role="img" />
          <Text component="h2" size="lg" fw="bold">
            {title}
          </Text>
        </Group>
        <Stack fz="sm" gap="xs">
          {children}
        </Stack>
      </Stack>
    </Card>
  );
}
