import { useInterval } from '@mantine/hooks';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import { useState } from 'react';

dayjs.extend(relativeTime);
dayjs.extend(utc);

export type TimestampsProps = {
  data: Record<string, unknown>;
};

export function Timestamps({ data }: TimestampsProps) {
  const computeValue = () => {
    if (!(data.createdAt && data.updatedAt)) return '';
    const { createdAt, updatedAt } = data as { createdAt: string; updatedAt: string };
    const created = dayjs.utc(createdAt).fromNow();
    const updated = dayjs.utc(updatedAt).fromNow();
    let newValue = `(created ${created}`;
    if (updated !== created) newValue += `, updated ${updated}`;
    newValue += ')';
    return newValue;
  };

  const [value, setValue] = useState(computeValue());
  useInterval(() => setValue(computeValue()), 30_000, { autoInvoke: true });

  return value;
}
