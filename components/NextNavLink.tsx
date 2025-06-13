'use client';

import type { NavLinkProps } from '@mantine/core';
import { NavLink } from '@mantine/core';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NextNavLinkProps = Omit<NavLinkProps, 'component'> & { href: string };

export function NextNavLink({ href, ...otherProps }: NextNavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return <NavLink active={isActive} component={Link} href={href} {...otherProps} />;
}
