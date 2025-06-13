'use server';

import { and, eq } from 'drizzle-orm';
import type { z } from 'zod';
import { usersTable } from '~/database';
import { hashPassword, setSessionUserId } from '~/lib/auth';
import { db } from '~/lib/db';
import { loginSchema } from '~/validation/loginSchema';

export async function login(input: z.input<typeof loginSchema>) {
  const { email, password } = loginSchema.parse(input);
  const user = await db.query.usersTable.findFirst({
    where: and(eq(usersTable.email, email), eq(usersTable.passwordHash, await hashPassword(password))),
    columns: { id: true },
  });
  if (!user) throw new Error('Invalid email or password');
  await setSessionUserId(user.id);
}
