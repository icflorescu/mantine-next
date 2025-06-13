import { createId } from '@paralleldrive/cuid2';
import { relations, sql } from 'drizzle-orm';
import * as t from 'drizzle-orm/sqlite-core';
import { invoicesTable } from './invoicesTable';

export const invoiceItemsTable = t.sqliteTable(
  'invoiceItems',
  {
    id: t.text().$defaultFn(createId).primaryKey(),
    invoiceId: t
      .text()
      .notNull()
      .references(() => invoicesTable.id, { onDelete: 'cascade' }),
    index: t.integer().notNull(),
    description: t.text().notNull(),
    unit: t.text().notNull(),
    unitPrice: t.numeric({ mode: 'number' }).notNull(),
    quantity: t.numeric({ mode: 'number' }).notNull(),
  },
  (table) => [
    t.index('invoiceItems_invoice_id_idx').on(table.invoiceId),
    t.check('invoiceItems_index_check', sql`${table.index} >= 0`),
  ],
);

export const invoiceItemRelations = relations(invoiceItemsTable, ({ one }) => ({
  invoice: one(invoicesTable, {
    fields: [invoiceItemsTable.invoiceId],
    references: [invoicesTable.id],
  }),
}));
