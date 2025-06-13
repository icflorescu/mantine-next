'use client';

import type { OnDragEndResponder } from '@hello-pangea/dnd';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardSection,
  Divider,
  Flex,
  Grid,
  GridCol,
  Group,
  InputLabel,
  Loader,
  NumberInput,
  Select,
  Stack,
  Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { Form, useForm } from '@mantine/form';
import { upperFirst } from '@mantine/hooks';
import { IconArrowBackUp, IconCloudUpload, IconEdit, IconPlus, IconRestore } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from 'mantine-form-zod-resolver';
import { useRef, useState } from 'react';
import { proxy } from 'valtio';
import { saveInvoice } from '~/actions/saveInvoice';
import { useAction } from '~/hooks/useAction';
import { comboboxProps } from '~/lib/comboboxProps';
import { useTRPC } from '~/lib/trpc/client';
import type { InvoiceSaveSchema } from '~/validation/invoiceSaveSchema';
import { invoiceSaveSchema } from '~/validation/invoiceSaveSchema';
import { InvoiceStatus } from '~/validation/InvoiceStatus';
import { GrandTotal } from './GrandTotal';
import { InvoiceField } from './InvoiceField';
import { InvoiceItem } from './InvoiceItem';
import { Timestamps } from './Timestamps';

const INVOICE_STATUS_OPTIONS = InvoiceStatus.map((status) => ({ value: status, label: upperFirst(status) }));

export function ClientPage({ initialValues }: { initialValues: InvoiceSaveSchema }) {
  const trpc = useTRPC();

  const [seriesOpened, setSeriesOpened] = useState(false);
  const seriesOptions = useQuery({ ...trpc.invoices.listOptions.queryOptions('series'), enabled: seriesOpened });

  const [currencyCodeOpened, setCurrencyCodeOpened] = useState(false);
  const currencyCodeOptions = useQuery({
    ...trpc.invoices.listOptions.queryOptions('currencyCode'),
    enabled: currencyCodeOpened,
  });

  const [fromOpened, setFromOpened] = useState(false);
  const fromOptions = useQuery({ ...trpc.invoices.listOptions.queryOptions('from'), enabled: fromOpened });

  const [toOpened, setToOpened] = useState(false);
  const toOptions = useQuery({ ...trpc.invoices.listOptions.queryOptions('to'), enabled: toOpened });

  const form = useForm<InvoiceSaveSchema>({
    mode: 'uncontrolled',
    validate: zodResolver(invoiceSaveSchema),
    initialValues,
  });

  const grandTotal = useRef(
    proxy({
      amount: initialValues.items.reduce((acc, r) => acc + r.quantity * r.unitPrice, 0),
      currencyCode: initialValues.currencyCode,
    }),
  );

  form.watch('currencyCode', ({ value }) => {
    grandTotal.current.currencyCode = value;
  });

  const handleItemTotalChange = () => {
    grandTotal.current.amount = form.getValues().items.reduce((acc, r) => acc + r.quantity * r.unitPrice, 0);
  };

  const { execute: save, isExecuting: isSaving } = useAction(saveInvoice, { onSuccess: () => history.back() });

  const handleFieldAddClick = (type: 'fromFields' | 'toFields') => () => {
    form.insertListItem(type, { id: null, name: '', value: '', tmp_id: Date.now() });
    requestAnimationFrame(() => {
      const node = form.getInputNode(`${type}.${form.getValues()[type].length - 1}.name`);
      node?.focus();
    });
  };

  const handleItemAddClick = () => {
    form.insertListItem('items', {
      id: null,
      description: '',
      unit: '',
      unitPrice: '',
      quantity: '',
      tmp_id: Date.now(),
    });
    requestAnimationFrame(() => {
      const node = form.getInputNode(`items.${form.getValues().items.length - 1}.description`);
      node?.focus();
    });
  };

  const handleFieldsDragEnd =
    (type: 'fromFields' | 'toFields'): OnDragEndResponder<string> =>
    ({ destination, source }) => {
      if (!destination || destination.index === source.index) return;
      form.reorderListItem(type, { from: source.index, to: destination.index });
    };

  const handleItemsDragEnd: OnDragEndResponder<string> = ({ destination, source }) => {
    if (!destination || destination.index === source.index) return;
    form.reorderListItem('items', { from: source.index, to: destination.index });
  };

  const getFields = (type: 'fromFields' | 'toFields') => {
    return form.getValues()[type].map(({ id, tmp_id }, index) => (
      <Draggable key={id ?? tmp_id} index={index} draggableId={id ?? String(tmp_id)}>
        {(provided) => <InvoiceField provided={provided} form={form} type={type} index={index} />}
      </Draggable>
    ));
  };

  const isPristine = !form.isDirty();

  return (
    <Card withBorder radius="sm">
      <CardSection withBorder px="md" py="xs" mb="md">
        <Group gap="xs">
          <IconEdit size={18} />
          <Title order={2} fz="h4" mb={-2}>
            {initialValues.id ? `Invoice ${initialValues.series}-${initialValues.number}` : 'New invoice'}
          </Title>
        </Group>
      </CardSection>
      <Form form={form} onSubmit={save}>
        <Grid>
          <GridCol span={{ md: 2 }}>
            <Autocomplete
              label="Series"
              comboboxProps={{
                ...comboboxProps,
                onOpen: () => setSeriesOpened(true),
                onClose: () => setSeriesOpened(false),
              }}
              key={form.key('series')}
              {...form.getInputProps('series')}
              data={seriesOptions.data}
              rightSection={seriesOptions.isFetching && <Loader size="xs" />}
            />
          </GridCol>
          <GridCol span={{ md: 2 }}>
            <NumberInput
              label="Number"
              key={form.key('number')}
              {...form.getInputProps('number')}
              allowDecimal={false}
              allowNegative={false}
              hideControls
            />
          </GridCol>
          <GridCol span={{ md: 2 }}>
            <DateInput
              highlightToday
              popoverProps={comboboxProps}
              label="Issue date"
              key={form.key('issueDate')}
              {...form.getInputProps('issueDate')}
              valueFormat="MMM D YYYY"
            />
          </GridCol>
          <GridCol span={{ md: 2 }}>
            <DateInput
              label="Due date"
              key={form.key('dueDate')}
              {...form.getInputProps('dueDate')}
              valueFormat="MMM D YYYY"
            />
          </GridCol>
          <GridCol span={{ md: 2 }}>
            <Autocomplete
              comboboxProps={{
                ...comboboxProps,
                onOpen: () => setCurrencyCodeOpened(true),
                onClose: () => setCurrencyCodeOpened(false),
              }}
              label="Currency"
              key={form.key('currencyCode')}
              {...form.getInputProps('currencyCode')}
              data={currencyCodeOptions.data}
              rightSection={currencyCodeOptions.isFetching && <Loader size="xs" />}
            />
          </GridCol>
          <GridCol span={{ md: 2 }}>
            <Select
              label="Status"
              key={form.key('status')}
              {...form.getInputProps('status')}
              data={INVOICE_STATUS_OPTIONS}
              checkIconPosition="right"
              allowDeselect={false}
            />
          </GridCol>
        </Grid>
        <Divider mt="md" mx="-md" />
        <Flex mt="md" direction={{ base: 'column', md: 'row' }} gap="md">
          <Stack flex={1} gap={4}>
            <Autocomplete
              comboboxProps={{
                ...comboboxProps,
                onOpen: () => setFromOpened(true),
                onClose: () => setFromOpened(false),
              }}
              label="From"
              key={form.key('from')}
              {...form.getInputProps('from')}
              data={fromOptions.data}
              rightSection={fromOptions.isFetching && <Loader size="xs" />}
            />
            <DragDropContext onDragEnd={handleFieldsDragEnd('fromFields')}>
              <Droppable droppableId="fromFields" direction="vertical">
                {(provided) => (
                  <Box mt={-4} {...provided.droppableProps} ref={provided.innerRef}>
                    {getFields('fromFields')}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </DragDropContext>
            <Button variant="default" onClick={handleFieldAddClick('fromFields')} leftSection={<IconPlus size={16} />}>
              Add field
            </Button>
          </Stack>
          <Divider hiddenFrom="md" />
          <Divider visibleFrom="md" orientation="vertical" my="-md" />
          <Stack flex={1} gap={4}>
            <Autocomplete
              comboboxProps={{
                ...comboboxProps,
                onOpen: () => setToOpened(true),
                onClose: () => setToOpened(false),
              }}
              label="To"
              key={form.key('to')}
              {...form.getInputProps('to')}
              data={toOptions.data}
              rightSection={toOptions.isFetching && <Loader size="xs" />}
            />
            <DragDropContext onDragEnd={handleFieldsDragEnd('toFields')}>
              <Droppable droppableId="toFields" direction="vertical">
                {(provided) => (
                  <Box mt={-4} {...provided.droppableProps} ref={provided.innerRef}>
                    {getFields('toFields')}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </DragDropContext>
            <Button variant="default" onClick={handleFieldAddClick('toFields')} leftSection={<IconPlus size={16} />}>
              Add field
            </Button>
          </Stack>
        </Flex>
        <Divider mt="md" mx="-md" />
        <Stack mt="xs" gap={4}>
          <InputLabel>Billed items</InputLabel>
          <DragDropContext onDragEnd={handleItemsDragEnd}>
            <Droppable droppableId="items" direction="vertical">
              {(provided) => (
                <Box mt={-4} {...provided.droppableProps} ref={provided.innerRef}>
                  {form.getValues().items.map(({ id, tmp_id }, index) => (
                    <Draggable key={id ?? tmp_id} index={index} draggableId={id ?? String(tmp_id)}>
                      {(provided) => (
                        <InvoiceItem
                          provided={provided}
                          form={form}
                          index={index}
                          onTotalChange={handleItemTotalChange}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </DragDropContext>
          <Button variant="default" onClick={handleItemAddClick} leftSection={<IconPlus size={16} />}>
            Add item
          </Button>
        </Stack>
        <Divider mt="md" mx="-md" />
        <Flex mt="lg" direction={{ base: 'column', md: 'row' }} align="center" gap="md" justify="space-between">
          <Box fz="sm" c="dimmed" fw="bold" ta={{ base: 'center', xs: 'initial' }}>
            Total: <GrandTotal data={grandTotal} /> <Timestamps data={initialValues} />
          </Box>
          <Flex justify="center" wrap={{ base: 'wrap', xs: 'nowrap' }} gap="xs">
            <Button variant="default" leftSection={<IconArrowBackUp size={16} />} onClick={() => history.back()}>
              Cancel
            </Button>
            <Button
              variant="default"
              leftSection={<IconRestore size={16} />}
              disabled={isPristine}
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button type="submit" leftSection={<IconCloudUpload size={16} />} disabled={isPristine} loading={isSaving}>
              Save
            </Button>
          </Flex>
        </Flex>
      </Form>
    </Card>
  );
}
