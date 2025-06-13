import { and, asc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { invoiceFieldsTable, invoiceItemsTable, invoicesTable } from '~/database';
import { db } from '~/lib/db';
import { protectedProcedure } from '~/lib/trpc/server/utils';

export const listOptions = protectedProcedure
  .input(z.enum(['series', 'currencyCode', 'from', 'to']))
  .query(async ({ input: type, ctx: { userId } }) => {
    return db
      .selectDistinct({ [type]: invoicesTable[type] })
      .from(invoicesTable)
      .where(eq(invoicesTable.userId, userId))
      .orderBy(asc(invoicesTable[type]))
      .then((rows) => rows.map((r) => r[type]));
  });

export const listFieldNameOptions = protectedProcedure
  .input(z.enum(['from', 'to']))
  .query(async ({ input: type, ctx: { userId } }) => {
    return db
      .selectDistinct({ name: invoiceFieldsTable.name })
      .from(invoiceFieldsTable)
      .leftJoin(invoicesTable, eq(invoiceFieldsTable.invoiceId, invoicesTable.id))
      .where(and(eq(invoicesTable.userId, userId), eq(invoiceFieldsTable.type, type)))
      .orderBy(asc(invoiceFieldsTable.name))
      .then((rows) => rows.map((r) => r.name));
  });

export const listFieldValueOptions = protectedProcedure
  .input(z.object({ fieldType: z.enum(['from', 'to']), typeValue: z.string(), fieldName: z.string() }))
  .query(async ({ input: { fieldType, typeValue, fieldName }, ctx: { userId } }) => {
    return db
      .selectDistinct({ value: invoiceFieldsTable.value })
      .from(invoiceFieldsTable)
      .leftJoin(invoicesTable, eq(invoiceFieldsTable.invoiceId, invoicesTable.id))
      .where(
        and(
          eq(invoicesTable.userId, userId),
          eq(invoicesTable[fieldType], typeValue),
          eq(invoiceFieldsTable.type, fieldType),
          eq(invoiceFieldsTable.name, fieldName),
        ),
      )
      .orderBy(asc(invoiceFieldsTable.value))
      .then((rows) => rows.map((r) => r.value));
  });

export const listUnits = protectedProcedure.query(async ({ ctx: { userId } }) => {
  return db
    .selectDistinct({ unit: invoiceItemsTable.unit })
    .from(invoiceItemsTable)
    .leftJoin(invoicesTable, eq(invoiceItemsTable.invoiceId, invoicesTable.id))
    .where(eq(invoicesTable.userId, userId))
    .orderBy(asc(invoiceItemsTable.unit))
    .then((rows) => rows.map((r) => r.unit));
});
