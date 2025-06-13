'use client';

import { ActionIcon, Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NewInvoiceButton() {
  const pathname = usePathname();

  if (pathname !== '/invoices') return null;

  return (
    <>
      <ActionIcon variant="light" title="Logout" hiddenFrom="sm" component={Link} href="/invoices/new">
        <IconPlus strokeWidth={3} />
      </ActionIcon>
      <Button
        variant="light"
        title="Add new invoice"
        size="xs"
        visibleFrom="sm"
        leftSection={<IconPlus size={16} />}
        component={Link}
        href="/invoices/new"
      >
        New invoice
      </Button>
    </>
  );
}
