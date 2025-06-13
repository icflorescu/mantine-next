import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import * as t from 'drizzle-orm/sqlite-core';
import { invoicesTable } from './invoicesTable';

export const usersTable = t.sqliteTable('users', {
  id: t.text().$defaultFn(createId).primaryKey(),
  email: t.text().notNull().unique(),
  passwordHash: t.text().notNull(),
});

export const userRelations = relations(usersTable, ({ many }) => ({
  invoices: many(invoicesTable),
}));
