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
