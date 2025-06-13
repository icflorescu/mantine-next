import { useOs } from '@mantine/hooks';

export function useModKey() {
  const os = useOs();
  return os === 'macos' || os === 'ios' ? '⌘' : 'Ctrl';
}
