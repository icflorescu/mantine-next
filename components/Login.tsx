'use client';

import { Button, Card, CardSection, Group, List, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core';
import { Form, useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import { IconLockFilled } from '@tabler/icons-react';
import { zodResolver } from 'mantine-form-zod-resolver';
import { useRouter } from 'next/navigation';
import { login } from '~/actions/login';
import { useAction } from '~/hooks/useAction';
import { loginSchema } from '~/validation/loginSchema';

export function Login() {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { email: 'user1@example.com', password: 'Secret.1' },
    validate: zodResolver(loginSchema),
  });
  const router = useRouter();
  const { execute: handleSubmit, isExecuting: isPending } = useAction(login, {
    onSuccess: () => router.refresh(),
    onError: (err) => {
      modals.open({
        size: 260,
        title: 'Authentication error',
        children: (
          <Stack>
            <Text size="sm">{(err as Error).message}</Text>
            <Button
              color="red"
              onClick={() => {
                modals.closeAll();
                form.getInputNode('email')?.focus();
              }}
            >
              Try again
            </Button>
          </Stack>
        ),
      });
    },
  });

  return (
    <Stack mt="xl" align="center">
      <Card withBorder shadow="sm" radius="md" w={260}>
        <CardSection withBorder px="md" py="xs" mb="md">
          <Group gap="xs">
            <IconLockFilled size={18} />
            <Title order={2} fz="h4" mb={-2}>
              Protected section
            </Title>
          </Group>
        </CardSection>
        <Form form={form} onSubmit={handleSubmit}>
          <Stack>
            <TextInput label="Email" key={form.key('email')} {...form.getInputProps('email')} />
            <PasswordInput label="Password" key={form.key('password')} {...form.getInputProps('password')} />
            <Button type="submit" loading={isPending}>
              Login
            </Button>
          </Stack>
        </Form>
      </Card>
      <Stack gap="xs" fz="xs" pl="md" c="dimmed" w={260}>
        <div>Valid credentials:</div>
        <List fz="inherit">
          <List.Item>
            Email: user<em>[x]</em>@example.com
          </List.Item>
          <List.Item>
            Password: Secret.<em>[x]</em>
          </List.Item>
        </List>
        <div>
          ...where <em>x</em> is a number from <span>0</span> to <span>3</span>.
        </div>
      </Stack>
    </Stack>
  );
}
