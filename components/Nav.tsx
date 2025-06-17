'use client';

import { NavLink, RemoveScroll, ScrollArea } from '@mantine/core';
import { IconBrandGithub, IconClipboardText, IconHeart, IconHome2 } from '@tabler/icons-react';
import clsx from 'clsx';
import { useSnapshot } from 'valtio';
import { useThrottledWindowEvent } from '~/hooks/useThrottledWindowEvent';
import { hideMobileNav, store } from '~/lib/store';
import classes from './Nav.module.css';
import { NextNavLink } from './NextNavLink';

export function Nav() {
  const { mobileNavVisible } = useSnapshot(store);

  useThrottledWindowEvent('resize', () => {
    if (mobileNavVisible) hideMobileNav();
  });

  return (
    <RemoveScroll enabled={mobileNavVisible}>
      <nav className={clsx(classes.root, { [classes.visible]: mobileNavVisible })} onTouchStart={hideMobileNav}>
        <ScrollArea className={classes.scrollArea} onTouchStart={(e) => e.stopPropagation()} onTouchEnd={hideMobileNav}>
          <NextNavLink
            className={classes.navLink}
            href="/"
            label="Home"
            leftSection={<IconHome2 size={16} strokeWidth={1.5} />}
          />
          <NextNavLink
            className={classes.navLink}
            href="/invoices"
            label="Invoices example"
            leftSection={<IconClipboardText size={16} strokeWidth={1.5} />}
          />
          <NavLink
            target="_blank"
            href="https://github.com/sponsors/icflorescu"
            rel="noopener noreferrer"
            className={classes.navLink}
            label="Sponsor the project"
            leftSection={<IconHeart size={16} strokeWidth={1.5} />}
          />
          <NavLink
            href="https://github.com/icflorescu/mantine-next"
            target="_blank"
            rel="noopener noreferrer"
            className={classes.navLink}
            label="Source code"
            leftSection={<IconBrandGithub size={16} strokeWidth={1.5} />}
          />
        </ScrollArea>
      </nav>
    </RemoveScroll>
  );
}
