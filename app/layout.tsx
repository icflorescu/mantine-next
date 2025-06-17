// Import Mantine styles first
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
// Then other stuff
import { ColorSchemeScript, Container, mantineHtmlProps, MantineProvider, type ContainerProps } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import { Footer } from '~/components/Footer';
import { Header } from '~/components/Header';
import { LogoutButton } from '~/components/Header/LogoutButton';
import { NewInvoiceButton } from '~/components/Header/NewInvoiceButton';
import { Nav } from '~/components/Nav';
import { sessionHasUserId } from '~/lib/auth';
import { TRPCClientProvider } from '~/lib/trpc/client';
import classes from './layout.module.css';

export const metadata: Metadata = {
  title: 'Mantine Next - The easiest way to get started with Mantine, Next.js and tRPC.',
  description: 'The easiest way to get started with Mantine, Next.js and tRPC.',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

const CONTAINER_SIZE: ContainerProps['size'] = 'xl';

export default async function RootLayout({ children }: PropsWithChildren) {
  const isAuthenticated = await sessionHasUserId();
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={classes.root}>
        <TRPCClientProvider>
          <MantineProvider>
            <ModalsProvider>
              <Header containerSize={CONTAINER_SIZE}>
                {isAuthenticated && (
                  <>
                    <NewInvoiceButton />
                    <LogoutButton />
                  </>
                )}
              </Header>
              <Container size={CONTAINER_SIZE}>
                <Nav />
                <div className={classes.content}>
                  <main className={classes.main}>{children}</main>
                  <Footer />
                </div>
              </Container>
            </ModalsProvider>
          </MantineProvider>
        </TRPCClientProvider>
      </body>
    </html>
  );
}
