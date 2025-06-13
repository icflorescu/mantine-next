import type { Config } from 'drizzle-kit';

export default {
  schema: './database',
  dialect: 'sqlite',
  dbCredentials: { url: process.env.DATABASE_URL },
} satisfies Config;
