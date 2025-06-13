'use client';

import { ActionIcon, Button } from '@mantine/core';
import { IconLogout } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { logout } from '~/actions/logout';
import { useAction } from '~/hooks/useAction';

export function LogoutButton() {
  const router = useRouter();
  const { execute: executeLogout, isExecuting: isLoggingOut } = useAction(logout, {
    onSuccess: () => router.refresh(),
  });

  const handleClick = () => executeLogout();

  return (
    <>
      <ActionIcon
        variant="transparent"
        color="orange"
        title="Logout"
        onClick={handleClick}
        loading={isLoggingOut}
        hiddenFrom="sm"
      >
        <IconLogout size={16} strokeWidth={1.5} />
      </ActionIcon>
      <Button
        variant="light"
        color="orange"
        title="Logout"
        size="xs"
        onClick={handleClick}
        loading={isLoggingOut}
        visibleFrom="sm"
        leftSection={<IconLogout size={16} />}
      >
        Logout
      </Button>
    </>
  );
}
