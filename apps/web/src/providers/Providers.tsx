import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { FC, PropsWithChildren } from 'react';
import { WagmiProvider } from 'wagmi';
import { config } from './wagmi-provider';

const queryClient = new QueryClient();

const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    </WagmiProvider>
  );
};

export default Providers;
