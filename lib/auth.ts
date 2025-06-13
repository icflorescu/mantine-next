import type { SessionOptions } from 'iron-session';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { pbkdf2 } from 'node:crypto';
import { cache } from 'react';

export type SessionData = { userId?: string };

export const sessionOptions: SessionOptions = {
  password: process.env.IRON_SESSION_PASSWORD,
  cookieName: process.env.IRON_SESSION_COOKIE_NAME,
  ttl: Number(process.env.IRON_SESSION_TTL.replaceAll(/[^\d]/g, '')),
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production', // Comment this line for local preview
    // secure: false // Uncomment this line for local preview
  },
};

export function hashPassword(password: string) {
  return new Promise<string>((resolve, reject) => {
    pbkdf2(password, 'salt', 100000, 64, 'sha256', (err, derivedKey) => {
      if (err) reject(err);
      resolve(derivedKey.toString('hex'));
    });
  });
}

export async function setSessionUserId(userId: string) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  session.userId = userId;
  await session.save();
}

export const getSessionUserId = cache(
  async () => (await getIronSession<SessionData>(await cookies(), sessionOptions)).userId,
);

export const sessionHasUserId = cache(async () => !!(await getSessionUserId()));

export async function destroySession() {
  (await getIronSession<SessionData>(await cookies(), sessionOptions)).destroy();
}
