import '@mantine/core/styles.css';

import React from 'react';
import { ColorSchemeScript, mantineHtmlProps, MantineProvider, Box, Container } from '@mantine/core';
import { theme } from '../theme';

import { Footer } from '../components/Footer/Footer';

export const metadata = {
  title: 'Step Counter',
  description: 'Recommended Step Counter',
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <Box style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Box style={{ flex: 1 }}>
              <Container size="md">
                <Box p="md">
                 {children}
                </Box>
              </Container>
            </Box>
            <Footer />
          </Box>
        </MantineProvider>
      </body>
    </html>
  );
}
