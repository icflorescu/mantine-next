'use server';

import { and, eq, notInArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import type { z } from 'zod';
import { invoiceFieldsTable, invoiceItemsTable, invoicesTable } from '~/database';
import { getSessionUserId } from '~/lib/auth';
import { db } from '~/lib/db';
import { omit } from '~/lib/utils/omit';
import { invoiceSaveSchema } from '~/validation/invoiceSaveSchema';

export async function saveInvoice(input: z.input<typeof invoiceSaveSchema>) {
  const userId = await getSessionUserId();
  if (!userId) throw new Error('Not authenticated');
  const { id, fromFields, toFields, items: itemsInput, ...rest } = invoiceSaveSchema.parse(input);

  const fields = [
    ...fromFields.map((r, index) => ({ ...r, type: 'from' as const, index })),
    ...toFields.map((r, index) => ({ ...r, type: 'to' as const, index })),
  ].map((r) => omit(r, 'tmp_id'));
  const items = itemsInput.map((r, index) => ({ ...omit(r, 'tmp_id'), index }));

  await db.transaction(async (db) => {
    if (id) {
      // Update existing invoice and related records
      const invoiceId = id;

      const fieldsToUpdate = fields.filter((r): r is typeof r & { id: string } => r.id !== null);
      const itemsToUpdate = items.filter((r): r is typeof r & { id: string } => r.id !== null);
      const fieldsToCreate = fields.filter((r) => r.id === null).map((r) => omit(r, 'id'));
      const itemsToCreate = items.filter((r) => r.id === null).map((r) => omit(r, 'id'));

      await Promise.all([
        // update invoice
        db
          .update(invoicesTable)
          .set(rest)
          .where(and(eq(invoicesTable.id, invoiceId), eq(invoicesTable.userId, userId))),
        // update kept fields
        Promise.all(
          fieldsToUpdate.map(({ id: fieldId, ...fieldRest }) =>
            db.update(invoiceFieldsTable).set(fieldRest).where(eq(invoiceFieldsTable.id, fieldId)),
          ),
        ),
        // update kept items
        Promise.all(
          itemsToUpdate.map(({ id: itemId, ...itemRest }) =>
            db.update(invoiceItemsTable).set(itemRest).where(eq(invoiceItemsTable.id, itemId)),
          ),
        ),
        // delete removed fields
        db.delete(invoiceFieldsTable).where(
          and(
            eq(invoiceFieldsTable.invoiceId, invoiceId),
            notInArray(
              invoiceFieldsTable.id,
              fieldsToUpdate.map((r) => r.id),
            ),
          ),
        ),
        // delete removed items
        db.delete(invoiceItemsTable).where(
          and(
            eq(invoiceItemsTable.invoiceId, invoiceId),
            notInArray(
              invoiceItemsTable.id,
              itemsToUpdate.map((r) => r.id),
            ),
          ),
        ),
        // create new fields
        fieldsToCreate.length > 0 &&
          db.insert(invoiceFieldsTable).values(fieldsToCreate.map((field) => ({ invoiceId, ...field }))),
        // create new items
        itemsToCreate.length > 0 &&
          db.insert(invoiceItemsTable).values(itemsToCreate.map((item) => ({ invoiceId, ...item }))),
      ]);
    } else {
      // Create new invoice and related records
      const [{ id: invoiceId }] = await db
        .insert(invoicesTable)
        .values({ userId, ...rest })
        .returning({ id: invoicesTable.id });
      await Promise.all([
        fields.length > 0 && db.insert(invoiceFieldsTable).values(fields.map((r) => ({ invoiceId, ...omit(r, 'id') }))),
        db.insert(invoiceItemsTable).values(items.map((r) => ({ invoiceId, ...omit(r, 'id') }))),
      ]);
    }
  });

  revalidatePath('/invoices');
}
