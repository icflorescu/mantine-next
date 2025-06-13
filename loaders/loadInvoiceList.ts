import { asc, desc, eq, sql } from 'drizzle-orm';
import type { z } from 'zod';
import { invoiceItemsTable, invoicesTable } from '~/database';
import { db } from '~/lib/db';
import type { invoiceListSchema } from '~/validation/invoiceListSchema';

const SORTABLE_COLUMNS = {
  issueDate: invoicesTable.issueDate,
  dueDate: invoicesTable.dueDate,
  to: invoicesTable.to,
};

export async function loadInvoiceList({
  userId,
  page,
  pageSize,
  sortBy,
  sortOrder,
}: z.output<typeof invoiceListSchema> & { userId: string }) {
  const [total, rows] = await Promise.all([
    db.$count(invoicesTable, eq(invoicesTable.userId, userId)),
    db
      .select({
        id: invoicesTable.id,
        to: invoicesTable.to,
        series: invoicesTable.series,
        number: invoicesTable.number,
        issueDate: invoicesTable.issueDate,
        dueDate: invoicesTable.dueDate,
        amount: sql<number>`sum(${invoiceItemsTable.unitPrice} * ${invoiceItemsTable.quantity})`,
        currencyCode: invoicesTable.currencyCode,
        status: invoicesTable.status,
      })
      .from(invoicesTable)
      .leftJoin(invoiceItemsTable, eq(invoiceItemsTable.invoiceId, invoicesTable.id))
      .where(eq(invoicesTable.userId, userId))
      .groupBy(invoicesTable.id)
      .orderBy((sortOrder === 'asc' ? asc : desc)(SORTABLE_COLUMNS[sortBy]))
      .limit(pageSize)
      .offset((page - 1) * pageSize),
  ]);

  return { total, rows };
}
