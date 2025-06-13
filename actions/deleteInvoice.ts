'use server';

import { and, eq } from 'drizzle-orm';
import type { z } from 'zod';
import { invoicesTable } from '~/database';
import { getSessionUserId } from '~/lib/auth';
import { db } from '~/lib/db';
import { idSchema } from '~/validation/idSchema';

export async function deleteInvoice(input: z.input<typeof idSchema>) {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const userId = await getSessionUserId();
  if (!userId) throw new Error('Not authenticated');
  const id = idSchema.parse(input);
  await db.delete(invoicesTable).where(and(eq(invoicesTable.id, id), eq(invoicesTable.userId, userId)));
}
