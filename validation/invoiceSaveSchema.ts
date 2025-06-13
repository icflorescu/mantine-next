import { z } from 'zod';
import { InvoiceStatus } from './InvoiceStatus';

const invoiceFieldSchema = z.object({
  id: z.string().cuid2().nullable(),
  name: z.string().trim().min(1, 'Name is required'),
  value: z.string().trim().min(1, 'Value is required'),
  tmp_id: z.number().optional(),
});

export const invoiceSaveSchema = z
  .object({
    id: z.string().cuid2().nullable(),
    from: z.string().trim().min(1, 'From is required'),
    to: z.string().trim().min(1, 'To is required'),
    series: z.string().trim().min(1, 'Series is required').toUpperCase(),
    number: z.number({ invalid_type_error: 'Number is required' }).int().min(1),
    currencyCode: z.string().trim().length(3, 'Must be 3 characters long').toUpperCase(),
    issueDate: z.string().date(),
    dueDate: z.string().date(),
    status: z.enum(InvoiceStatus),
    fromFields: z.array(invoiceFieldSchema),
    toFields: z.array(invoiceFieldSchema),
    items: z.array(
      z.object({
        id: z.string().cuid2().nullable(),
        description: z.string().trim().min(1, 'Description is required'),
        quantity: z.number({ invalid_type_error: 'Quantity is required' }).min(0),
        unit: z.string().trim().min(1, 'Unit is required'),
        unitPrice: z.number({ invalid_type_error: 'Unit price is required' }).min(0),
        tmp_id: z.number().optional(),
      }),
    ),
  })
  .refine((r) => r.dueDate >= r.issueDate, {
    message: 'Due date must be equal to or after issue date',
    path: ['dueDate'],
  });

export type InvoiceSaveSchema = z.infer<typeof invoiceSaveSchema>;
