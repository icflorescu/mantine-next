export const InvoiceStatus = ['draft', 'sent', 'collected', 'cancelled'] as const;
export type InvoiceStatus = (typeof InvoiceStatus)[number];
