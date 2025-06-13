'use server';

import { destroySession } from '~/lib/auth';

export async function logout() {
  await destroySession();
}
