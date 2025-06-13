import { createId } from '@paralleldrive/cuid2';
import { relations, sql } from 'drizzle-orm';
import * as t from 'drizzle-orm/sqlite-core';
import { InvoiceStatus } from '~/validation/InvoiceStatus';
import { invoiceFieldsTable } from './invoiceFieldsTable';
import { invoiceItemsTable } from './invoiceItemsTable';
import { usersTable } from './usersTable';

export const invoicesTable = t.sqliteTable(
  'invoices',
  {
    id: t.text().$defaultFn(createId).primaryKey(),
    userId: t
      .text()
      .notNull()
      .references(() => usersTable.id),
    from: t.text().notNull(),
    to: t.text().notNull(),
    series: t.text().notNull(),
    number: t.integer().notNull(),
    currencyCode: t.text().notNull(),
    issueDate: t.text().notNull(),
    dueDate: t.text().notNull(),
    status: t.text({ enum: InvoiceStatus }).notNull(),
    createdAt: t
      .text()
      .notNull()
      .default(sql`current_timestamp`),
    updatedAt: t
      .text()
      .notNull()
      .default(sql`current_timestamp`)
      .$onUpdate(() => sql`current_timestamp`),
  },
  (table) => [
    t.index('invoices_user_id_idx').on(table.userId),
    t.unique('invoices_unq').on(table.userId, table.series, table.number),
  ],
);

export const invoiceRelations = relations(invoicesTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [invoicesTable.userId],
    references: [usersTable.id],
  }),
  fields: many(invoiceFieldsTable),
  items: many(invoiceItemsTable),
}));
