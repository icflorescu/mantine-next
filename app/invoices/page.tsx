import { Login } from '~/components/Login';
import { getSessionUserId } from '~/lib/auth';
import type { NextPageProps } from '~/lib/NextPageProps';
import { loadInvoiceList } from '~/loaders/loadInvoiceList';
import { invoiceListSchema } from '~/validation/invoiceListSchema';
import ClientPage from './ClientPage';

export default async function Page({ searchParams }: NextPageProps) {
  const [userId, parsedSearchParams] = await Promise.all([
    getSessionUserId(),
    searchParams.then(invoiceListSchema.parse),
  ]);
  if (!userId) return <Login />;
  return <ClientPage {...await loadInvoiceList({ userId, ...parsedSearchParams })} />;
}
