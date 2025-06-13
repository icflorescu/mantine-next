'use client';

import {
  ActionIcon,
  Center,
  Flex,
  Group,
  LoadingOverlay,
  NumberFormatter,
  Pagination,
  Select,
  Table,
  TableScrollContainer,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  Text,
} from '@mantine/core';
import { upperFirst } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import {
  IconCancel,
  IconDotsVertical,
  IconEdit,
  IconFileDots,
  IconInfoHexagon,
  IconMailForward,
  IconRosetteDiscountCheck,
  IconTrash,
} from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteInvoice } from '~/actions/deleteInvoice';
import { useAction } from '~/hooks/useAction';
import { useRefreshOnWindowFocus } from '~/hooks/useRefreshOnWindowFocus';
import { useSearchParamsUpdater } from '~/hooks/useSearchParamsUpdater';
import { useValidSearchParams } from '~/hooks/useValidSearchParams';
import { formatDate } from '~/lib/utils/formatDate';
import type { loadInvoiceList } from '~/loaders/loadInvoiceList';
import { invoiceListSchema } from '~/validation/invoiceListSchema';
import classes from './ClientPage.module.css';
import { SortableTableTh } from './SortableTableTh';

const PAGE_SIZES = [10, 20, 50, 100].map((pageSize) => {
  const value = pageSize.toString();
  return { value, label: value };
});

const STATUS_ICONS = {
  draft: <IconFileDots size={16} />,
  sent: <IconMailForward size={16} />,
  collected: <IconRosetteDiscountCheck size={16} />,
  cancelled: <IconCancel size={16} />,
};

export default function ClientPage({ total, rows }: Awaited<ReturnType<typeof loadInvoiceList>>) {
  useRefreshOnWindowFocus();
  const search = useValidSearchParams(invoiceListSchema);
  const router = useRouter();
  const updateSearchParams = useSearchParamsUpdater(invoiceListSchema);

  const { isExecuting: isDeleting, execute: destroy } = useAction(deleteInvoice);

  const handleDelete = (id: string) => () => {
    modals.openConfirmModal({
      title: 'Delete invoice',
      children: <Text size="sm">Are you sure you want to delete this invoice?</Text>,
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        destroy(id, {
          onSuccess: () => {
            modals.closeAll();
            if (rows.length === 1 && search.page > 1) {
              updateSearchParams({ page: search.page - 1 });
            } else {
              router.refresh();
            }
          },
        });
      },
    });
  };

  const start = (search.page - 1) * search.pageSize + 1;
  const end = Math.min(start + search.pageSize - 1, total);

  return (
    <>
      <TableScrollContainer
        minWidth={500}
        scrollAreaProps={{ offsetScrollbars: false, classNames: { scrollbar: classes.scrollbar } }}
        className={classes.scrollContainer}
        classNames={{ scrollContainerInner: classes.scrollContainerInner }}
      >
        <LoadingOverlay visible={isDeleting} />
        <Table withColumnBorders stickyHeader striped>
          <TableThead className={classes.tableHeader}>
            <TableTr>
              <TableTh>Invoice</TableTh>
              <SortableTableTh field="to" label="To" {...search} />
              <SortableTableTh field="issueDate" label="Issue date" ta="right" {...search} />
              <SortableTableTh field="dueDate" label="Due date" ta="right" {...search} />
              <TableTh ta="right">Amount</TableTh>
              <TableTh title="Status">
                <Center>
                  <IconInfoHexagon size={16} />
                </Center>
              </TableTh>
              <TableTh title="Actions" w={0}>
                <Center>
                  <IconDotsVertical size={16} />
                </Center>
              </TableTh>
            </TableTr>
          </TableThead>
          <TableTbody>
            {rows.map(({ id, series, number, issueDate, to, dueDate, amount, currencyCode, status }) => (
              <TableTr key={id}>
                <TableTd>
                  {series}-{number}
                </TableTd>
                <TableTd>{to}</TableTd>
                <TableTd ta="right">{formatDate(issueDate)}</TableTd>
                <TableTd ta="right">{formatDate(dueDate)}</TableTd>
                <TableTd ta="right">
                  <NumberFormatter value={amount} suffix={` ${currencyCode}`} thousandSeparator decimalScale={2} />
                </TableTd>
                <TableTd title={upperFirst(status)}>
                  <Center>{STATUS_ICONS[status]}</Center>
                </TableTd>
                <TableTd>
                  <Group gap="xs" wrap="nowrap">
                    <ActionIcon size="xs" variant="transparent" title="Edit" component={Link} href={`/invoices/${id}`}>
                      <IconEdit />
                    </ActionIcon>
                    <ActionIcon size="xs" color="red" variant="transparent" title="Delete" onClick={handleDelete(id)}>
                      <IconTrash />
                    </ActionIcon>
                  </Group>
                </TableTd>
              </TableTr>
            ))}
          </TableTbody>
        </Table>
      </TableScrollContainer>
      <Flex mt="md" direction={{ base: 'column', md: 'row' }} justify="space-between" align="center" rowGap="sm">
        <Text size="sm">
          {start} - {end} / {total} invoices
        </Text>
        <Pagination
          classNames={{ control: classes.paginationControl, dots: classes.paginationDots }}
          total={Math.ceil(total / search.pageSize)}
          value={search.page}
          onChange={(page) => updateSearchParams({ page })}
        />
        <Group gap="xs">
          <Text size="sm">Page size</Text>
          <Select
            w={66}
            comboboxProps={{ width: 80, withArrow: true }}
            classNames={{ wrapper: classes.selectWrapper }}
            checkIconPosition="right"
            value={search.pageSize.toString()}
            onChange={(pageSize) => updateSearchParams({ pageSize: Number(pageSize!) })}
            data={PAGE_SIZES}
          />
        </Group>
      </Flex>
    </>
  );
}
