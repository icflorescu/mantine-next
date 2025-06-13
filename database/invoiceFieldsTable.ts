import { createId } from '@paralleldrive/cuid2';
import { relations, sql } from 'drizzle-orm';
import * as t from 'drizzle-orm/sqlite-core';
import { invoicesTable } from './invoicesTable';

export const invoiceFieldsTable = t.sqliteTable(
  'invoiceFields',
  {
    id: t.text().$defaultFn(createId).primaryKey(),
    invoiceId: t
      .text()
      .notNull()
      .references(() => invoicesTable.id, { onDelete: 'cascade' }),
    index: t.integer().notNull(),
    type: t.text({ enum: ['from', 'to'] }).notNull(),
    name: t.text().notNull(),
    value: t.text().notNull(),
  },
  (table) => [
    t.index('invoiceFields_invoice_id_idx').on(table.invoiceId),
    t.check('invoiceFields_index_check', sql`${table.index} >= 0`),
  ],
);

export const invoiceFieldRelations = relations(invoiceFieldsTable, ({ one }) => ({
  invoice: one(invoicesTable, {
    fields: [invoiceFieldsTable.invoiceId],
    references: [invoicesTable.id],
  }),
}));
