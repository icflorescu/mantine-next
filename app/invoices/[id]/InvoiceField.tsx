import type { DraggableProvided } from '@hello-pangea/dnd';
import { ActionIcon, Autocomplete, Loader } from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import { IconTrash } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { comboboxProps } from '~/lib/comboboxProps';
import { useTRPC } from '~/lib/trpc/client';
import type { InvoiceSaveSchema } from '~/validation/invoiceSaveSchema';
import { DragHandle } from './DragHandle';
import classes from './InvoiceField.module.css';

export type InvoiceFieldsProps = {
  provided: DraggableProvided;
  form: UseFormReturnType<InvoiceSaveSchema>;
  type: 'fromFields' | 'toFields';
  index: number;
};

export function InvoiceField({ provided, form, type, index }: InvoiceFieldsProps) {
  const fieldType = type.slice(0, -6) as 'from' | 'to';
  const [typeValue, setTypeValue] = useState(form.getValues()[fieldType]);
  const [fieldName, setFieldName] = useState(form.getValues()[type][index].name);

  form.watch(fieldType, ({ value }) => {
    setTypeValue(value);
  });

  form.watch(`${type}.${index}.name`, ({ value }) => {
    setFieldName(value);
  });

  const trpc = useTRPC();

  const [nameOpened, setNameOpened] = useState(false);
  const nameOptions = useQuery({ ...trpc.invoices.listFieldNameOptions.queryOptions(fieldType), enabled: nameOpened });

  const [valueOpened, setValueOpened] = useState(false);
  const valueOptions = useQuery({
    ...trpc.invoices.listFieldValueOptions.queryOptions({ fieldType, typeValue, fieldName }),
    enabled: !!fieldName && valueOpened,
  });

  const handleDeleteClick = () => {
    form.removeListItem(type, index);
  };

  return (
    <div ref={provided.innerRef} className={classes.root} {...provided.draggableProps}>
      <DragHandle provided={provided} />
      <Autocomplete
        comboboxProps={{
          ...comboboxProps,
          onOpen: () => setNameOpened(true),
          onClose: () => setNameOpened(false),
        }}
        flex={1}
        placeholder="Field name"
        key={form.key(`${type}.${index}.name`)}
        {...form.getInputProps(`${type}.${index}.name`)}
        data={nameOptions.data}
        rightSection={nameOptions.isFetching && <Loader size="xs" />}
      />
      <Autocomplete
        comboboxProps={{
          ...comboboxProps,
          onOpen: () => setValueOpened(true),
          onClose: () => setValueOpened(false),
        }}
        flex={2}
        placeholder="Field value"
        key={form.key(`${type}.${index}.value`)}
        {...form.getInputProps(`${type}.${index}.value`)}
        data={valueOptions.data}
        rightSection={valueOptions.isFetching && <Loader size="xs" />}
      />
      <ActionIcon variant="light" size="input-sm" color="red" onClick={handleDeleteClick} title="Delete field">
        <IconTrash size={16} />
      </ActionIcon>
    </div>
  );
}
