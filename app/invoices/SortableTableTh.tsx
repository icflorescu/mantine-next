import { Group, TableTh, type TableThProps } from '@mantine/core';
import { IconArrowsUpDown, IconArrowUp } from '@tabler/icons-react';
import clsx from 'clsx';
import { useSearchParamsUpdater } from '~/hooks/useSearchParamsUpdater';
import { invoiceListSchema } from '~/validation/invoiceListSchema';
import classes from './SortableTableTh.module.css';

export type SortableTableThProps = {
  field: 'issueDate' | 'dueDate' | 'to';
  label: string;
  ta?: TableThProps['ta'];
  pageSize: number;
  sortBy: string;
  sortOrder: string;
};

export function SortableTableTh({ field, label, ta, pageSize, sortBy, sortOrder }: SortableTableThProps) {
  const isSortedAscByThisField = sortBy === field && sortOrder === 'asc';
  const updateSearchParams = useSearchParamsUpdater(invoiceListSchema);

  return (
    <TableTh
      className={classes.root}
      title={`Sort ${isSortedAscByThisField ? 'descending' : 'ascending'}`}
      ta={ta}
      onClick={() =>
        updateSearchParams({ page: 1, pageSize, sortBy: field, sortOrder: isSortedAscByThisField ? 'desc' : 'asc' })
      }
    >
      <Group className={classes.content}>
        <div className={classes.label}>{label}</div>
        {sortBy === field ? (
          <IconArrowUp size={16} className={clsx(classes.sortedIcon, { [classes.desc]: sortOrder === 'desc' })} />
        ) : (
          <IconArrowsUpDown size={12} className={classes.unsortedIcon} />
        )}
      </Group>
    </TableTh>
  );
}
