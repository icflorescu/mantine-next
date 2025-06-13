'use client';

import type { ContainerProps } from '@mantine/core';
import { ActionIcon, Burger, Container, Group } from '@mantine/core';
import { IconBrandGithub, IconHeartFilled } from '@tabler/icons-react';
import Link from 'next/link';
import type { PropsWithChildren } from 'react';
import { useSnapshot } from 'valtio';
import { Logo } from '~/components/Logo';
import { hideMobileNav, store, toggleMobileNavVisibility } from '~/lib/store';
import { ColorSchemeActionIcon } from './ColorSchemeActionIcon';
import { DevtoolsActionIcon } from './DevtoolsActionIcon';
import classes from './Header.module.css';

export type HeaderProps = PropsWithChildren<{
  containerSize: ContainerProps['size'];
}>;

export function Header({ containerSize, children }: HeaderProps) {
  const { mobileNavVisible } = useSnapshot(store);

  return (
    <header className={classes.root} onTouchStart={hideMobileNav}>
      <Container size={containerSize} h="100%">
        <Group justify="space-between" align="center" h="100%">
          <Group gap="xs">
            <Burger
              color="currentColor"
              hiddenFrom="sm"
              size="sm"
              aria-label="Toggle navigation"
              opened={mobileNavVisible}
              onTouchStart={(e) => {
                e.stopPropagation();
                toggleMobileNavVisibility();
              }}
            />
            <Link href="/">
              <h1 className={classes.title}>
                <Logo className={classes.logo} />
                Mantine Start
              </h1>
            </Link>
          </Group>
          <Group gap="xs">
            {children}
            {process.env.NODE_ENV === 'development' && <DevtoolsActionIcon />}
            <ActionIcon
              component="a"
              href="https://github.com/sponsors/icflorescu"
              target="_blank"
              rel="noopener noreferrer"
              variant="transparent"
              color="red"
              title="Sponsor this project"
            >
              <IconHeartFilled size={16} strokeWidth={1.5} />
            </ActionIcon>
            <ActionIcon
              component="a"
              href="https://github.com/icflorescu/mantine-start"
              target="_blank"
              rel="noopener noreferrer"
              variant="transparent"
              color="currentColor"
              title="View source on GitHub"
            >
              <IconBrandGithub size={16} strokeWidth={1.5} />
            </ActionIcon>
            <ColorSchemeActionIcon />
          </Group>
        </Group>
      </Container>
    </header>
  );
}
