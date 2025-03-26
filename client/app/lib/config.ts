'use client';

import { http, createStorage, cookieStorage } from 'wagmi'
import { sepolia, arbitrumSepolia, optimismSepolia } from 'wagmi/chains'
import { Chain, getDefaultConfig } from '@rainbow-me/rainbowkit'

const projectId = 'd823ab00663a4884813c16d8474f0ffd';

const supportedChains: readonly [Chain, ...Chain[]] = [sepolia, arbitrumSepolia, optimismSepolia];

export const config = getDefaultConfig({
   appName: 'WalletConnection',
   projectId,
   chains: supportedChains,
   ssr: true,
   storage: createStorage({
    storage: cookieStorage,
   }),
  transports: supportedChains.reduce((obj, chain) => ({ ...obj, [chain.id]: http() }), {})
 });