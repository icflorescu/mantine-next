'use client';

import { ActionIcon, useMantineColorScheme } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { IconMoon, IconSun } from '@tabler/icons-react';
import { useModKey } from '~/hooks/useModKey';
import classes from './ColorSchemeActionIcon.module.css';

export function ColorSchemeActionIcon() {
  const { toggleColorScheme } = useMantineColorScheme();
  useHotkeys([['mod+J', toggleColorScheme]]);
  const modKey = useModKey();

  return (
    <ActionIcon
      onClick={() => toggleColorScheme()}
      color="currentColor"
      variant="transparent"
      title={`Toggle color scheme (${modKey}+J)`}
    >
      <IconSun className={classes.sunIcon} size={22} strokeWidth={1.25} />
      <IconMoon className={classes.moonIcon} size={15} strokeWidth={1.5} />
    </ActionIcon>
  );
}
