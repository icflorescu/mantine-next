import { and, asc, eq } from 'drizzle-orm';
import type { z } from 'zod';
import { invoiceFieldsTable, invoiceItemsTable, invoicesTable } from '~/database';
import { db } from '~/lib/db';
import { omit } from '~/lib/utils/omit';
import type { invoiceLoadSchema } from '~/validation/invoiceLoadSchema';

export async function loadInvoice({ userId, id }: z.output<typeof invoiceLoadSchema> & { userId: string }) {
  if (id === 'new') {
    return {
      id: null,
      series: '',
      number: '' as unknown as number,
      issueDate: '',
      dueDate: '',
      currencyCode: '',
      status: 'draft' as const,
      from: '',
      to: '',
      fromFields: [],
      toFields: [],
      items: [],
    };
  }

  const invoice = await db.query.invoicesTable.findFirst({
    where: and(eq(invoicesTable.id, id), eq(invoicesTable.userId, userId)),
    with: {
      fields: {
        columns: { id: true, type: true, name: true, value: true },
        orderBy: asc(invoiceFieldsTable.index),
      },
      items: {
        columns: { id: true, description: true, unit: true, unitPrice: true, quantity: true },
        orderBy: asc(invoiceItemsTable.index),
      },
    },
  });
  if (!invoice) throw new Error('Invoice not found');
  const { fields, ...rest } = invoice;
  return {
    ...rest,
    fromFields: fields.filter((r) => r.type === 'from').map((r) => omit(r, 'type')),
    toFields: fields.filter((r) => r.type === 'to').map((r) => omit(r, 'type')),
  };
}
