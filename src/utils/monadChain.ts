export const monadTestnet = {
  id: 10143, // 👈 el chainId real (lo vimos en tu log)
  name: 'Monad Testnet',
  network: 'monad-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Monad',
    symbol: 'MON',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.monad.xyz'], // ⚠️ cambia esto por el endpoint real de Monad
    },
    public: {
      http: ['https://testnet-rpc.monad.xyz'], // igual que arriba
    },
  },
  blockExplorers: {
    default: {
      name: 'Monad Explorer',
      url: 'https://testnet.monadexplorer.com', // opcional, si existe
    },
  },
  testnet: true,
} as const;