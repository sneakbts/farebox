// Network aliases -> CAIP-2 ids + default facilitators
export const NETWORKS = {
  base: {
    caip2: "eip155:8453",
    label: "Base Mainnet",
    explorer: "https://basescan.org",
    // No reliable keyless public facilitator on mainnet: use --settler-key
    // (recommended) or pass --facilitator explicitly.
    defaultFacilitator: null,
  },
  "base-sepolia": {
    caip2: "eip155:84532",
    label: "Base Sepolia (testnet)",
    explorer: "https://sepolia.basescan.org",
    defaultFacilitator: "https://x402.org/facilitator",
  },
  robinhood: {
    caip2: "eip155:4663",
    label: "Robinhood Chain",
    explorer: "https://robinhoodchain.blockscout.com",
    // No public facilitator serves this chain: self-settlement only.
    defaultFacilitator: null,
    rpcUrl: "https://rpc.mainnet.chain.robinhood.com",
    // No USDC here; the native stablecoin is Paxos USDG, which supports
    // EIP-3009 (verified on-chain: authorizationState + EIP-712 domain
    // {name: "Global Dollar", version: "1", chainId: 4663}).
    asset: {
      address: "0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168",
      symbol: "USDG",
      decimals: 6,
      eip712: { name: "Global Dollar", version: "1" },
    },
  },
};

export function resolveNetwork(name) {
  const net = NETWORKS[name];
  if (!net) {
    throw new Error(
      `Unknown network "${name}". Supported: ${Object.keys(NETWORKS).join(", ")}`
    );
  }
  return net;
}
