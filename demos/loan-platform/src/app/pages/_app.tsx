import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';
import { VendiaClientProvider } from '../src/useVendiaClient';
import '../styles/globals.css';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <VendiaClientProvider>
        <Component {...pageProps} />
      </VendiaClientProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
