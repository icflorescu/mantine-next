'use client';

import { ActionIcon, Portal } from '@mantine/core';
import { useDisclosure, useHotkeys } from '@mantine/hooks';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import clsx from 'clsx';
import Image from 'next/image';
import src from '~/components/TanStackLogo.webp';
import classes from './DevtoolsActionIcon.module.css';

export function DevtoolsActionIcon() {
  const [opened, { toggle }] = useDisclosure();
  useHotkeys([['mod+d', toggle]]);

  return (
    <>
      <ActionIcon onClick={toggle} variant="transparent" radius="lg" title="Toggle TanStack devtools">
        <Image src={src} className={clsx(classes.img, { [classes.opened]: opened })} alt="TanStack logo" />
      </ActionIcon>
      {opened && (
        <Portal>
          <ReactQueryDevtools buttonPosition="bottom-right" initialIsOpen />
        </Portal>
      )}
    </>
  );
}
