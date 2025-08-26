"use client";

import { ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import {
  RainbowKitProvider,
  darkTheme,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import { Chain } from "viem/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@rainbow-me/rainbowkit/styles.css";

// 1. Definimos tu red personalizada
const MONAD_TESTNET: Chain = {
  id: 10143,
  name: "Monad Testnet",
  nativeCurrency: { name: "MON", symbol: "MON", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://testnet-rpc.monad.xyz"] },
    public: { http: ["https://testnet-rpc.monad.xyz"] },
  },
  blockExplorers: {
    default: {
      name: "Monad Explorer",
      url: "https://testnet.monadexplorer.com",
    },
  },
  testnet: true,
};

// 2. Configuración Wagmi + RainbowKit
const config = getDefaultConfig({
  appName: "Monad Coinflip",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!, // 👈 tu WalletConnect ID
  chains: [MONAD_TESTNET],
  ssr: true,
});

// 3. Crear instancia global de QueryClient para React Query
const queryClient = new QueryClient();

type ProvidersProps = {
  children: ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}