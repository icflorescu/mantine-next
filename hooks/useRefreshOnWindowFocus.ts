import { useWindowEvent } from '@mantine/hooks';
import { useRouter } from 'next/navigation';

export function useRefreshOnWindowFocus() {
  const router = useRouter();
  useWindowEvent('focus', () => router.refresh());
}
