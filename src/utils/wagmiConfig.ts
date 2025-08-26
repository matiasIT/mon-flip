// src/utils/wagmiConfig.ts
import { createConfig, http } from 'wagmi'
import { monadTestnet } from './monadChain'

export const wagmiConfig = createConfig({
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: http(monadTestnet.rpcUrls.default.http[0]),
  },
})