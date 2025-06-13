import { useSearchParams } from 'next/navigation';
import type { ZodSchema } from 'zod';

export function useValidSearchParams<T extends ZodSchema>(schema: T) {
  const sp = useSearchParams();
  return schema.parse(Object.fromEntries(sp));
}
