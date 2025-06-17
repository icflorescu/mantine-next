import { Anchor, Box, Divider, Text } from '@mantine/core';
import classes from './Footer.module.css';

export function Footer() {
  return (
    <footer className={classes.root}>
      <Text size="sm" ta="center">
        Built by{' '}
        <Anchor href="https://github.com/icflorescu" target="_blank" rel="noopener noreferrer">
          Ionut-Cristian Florescu
        </Anchor>{' '}
        and
        <Box component="br" hiddenFrom="xs" /> released under the{' '}
        <Anchor
          href="https://github.com/icflorescu/mantine-next/blob/main/LICENSE"
          target="_blank"
          rel="noopener noreferrer"
        >
          MIT license
        </Anchor>
        .
      </Text>
      <Divider my="xs" w={40} hiddenFrom="lg" />
      <Text size="sm" ta="center">
        Please{' '}
        <Anchor href="https://github.com/sponsors/icflorescu" target="_blank" rel="noopener noreferrer">
          sponsor my work
        </Anchor>{' '}
        if you find it useful!
      </Text>
    </footer>
  );
}
