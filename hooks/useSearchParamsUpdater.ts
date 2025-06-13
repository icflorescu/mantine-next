import { useRouter, useSearchParams } from 'next/navigation';
import type { z, ZodSchema } from 'zod';

export function useSearchParamsUpdater<T extends ZodSchema>(schema: T) {
  const sp = useSearchParams();
  const router = useRouter();
  const defaultParams = schema.parse({});

  return (params: z.input<T>) => {
    const search = new URLSearchParams(sp);
    const parsedParams = schema.parse(params);
    for (const [key, value] of Object.entries(parsedParams)) {
      if (value === defaultParams[key]) {
        search.delete(key);
      } else {
        search.set(key, (value as { toString: () => string }).toString());
      }
    }
    router.push(`?${search}`);
  };
}
