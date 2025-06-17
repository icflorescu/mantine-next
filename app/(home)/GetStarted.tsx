'use client';

import { Box, Button, SegmentedControl, Stack } from '@mantine/core';
import { useClipboard, useLocalStorage } from '@mantine/hooks';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import clsx from 'clsx';
import classes from './GetStarted.module.css';

const COMMAND = `gitpick icflorescu/mantine-next`;
const COMMANDS = {
  pnpm: `pnpx ${COMMAND}`,
  yarn: `npx ${COMMAND}`,
  bun: `bunx ${COMMAND}`,
  npm: `npx ${COMMAND}`,
};

export function GetStarted() {
  const [packageManager, setPackageManager] = useLocalStorage({
    key: 'mantine-next-package-manager',
    defaultValue: 'pnpm',
  });
  const { copy, copied } = useClipboard();

  return (
    <Stack gap="xs" align="center" w="100%">
      <SegmentedControl
        className={classes.border}
        size="xs"
        data={Object.keys(COMMANDS).map((key) => ({ label: key, value: key }))}
        value={packageManager}
        onChange={setPackageManager}
      />
      <Button
        variant="default"
        title="Copy to clipboard"
        rightSection={
          copied ? (
            <Box c="green">
              <IconCheck />
            </Box>
          ) : (
            <IconCopy />
          )
        }
        classNames={{ root: clsx(classes.border, classes.button), label: classes.buttonLabel }}
        onClick={() => {
          copy(COMMANDS[packageManager as keyof typeof COMMANDS]);
        }}
      >
        {COMMANDS[packageManager as keyof typeof COMMANDS]}
      </Button>
    </Stack>
  );
}
