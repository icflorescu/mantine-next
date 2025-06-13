import { useThrottledCallback } from '@mantine/hooks';
import { useEffect } from 'react';

export function useThrottledWindowEvent(
  eventName: keyof WindowEventMap,
  callback: (event: Event) => void,
  delay = 500,
) {
  const throttledCallback = useThrottledCallback(callback, delay);

  useEffect(() => {
    window.addEventListener(eventName, throttledCallback);
    return () => {
      window.removeEventListener(eventName, throttledCallback);
    };
  }, [eventName, throttledCallback]);
}
