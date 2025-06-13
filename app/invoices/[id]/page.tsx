import { Login } from '~/components/Login';
import { getSessionUserId } from '~/lib/auth';
import type { NextPageProps } from '~/lib/NextPageProps';
import { loadInvoice } from '~/loaders/loadInvoice';
import { invoiceLoadSchema } from '~/validation/invoiceLoadSchema';
import { ClientPage } from './ClientPage';

export default async function Page({ params }: NextPageProps) {
  const [userId, { id }] = await Promise.all([getSessionUserId(), params.then(invoiceLoadSchema.parse)]);
  if (!userId) return <Login />;
  return <ClientPage initialValues={await loadInvoice({ userId, id })} />;
}
