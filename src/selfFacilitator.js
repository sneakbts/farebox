// Self-settlement: run the facilitator inside farebox itself.
// No third-party facilitator, no API keys, no waitlist. You pay your own
// (sub-cent) gas on Base and depend on no one.
import { createWalletClient, http, publicActions } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base, baseSepolia } from "viem/chains";
import { x402Facilitator } from "@x402/core/facilitator";
import { ExactEvmScheme as ExactEvmFacilitatorScheme } from "@x402/evm/exact/facilitator";
import { toFacilitatorEvmSigner } from "@x402/evm";

const CHAINS = {
  "eip155:8453": base,
  "eip155:84532": baseSepolia,
};

/**
 * Build an in-process FacilitatorClient that verifies locally and settles
 * by broadcasting the payment transaction from the operator's own gas wallet.
 *
 * @param {object} opts
 * @param {`0x${string}`} opts.privateKey Settlement gas wallet private key
 * @param {string} opts.caip2 Network id, e.g. "eip155:8453"
 * @param {string} [opts.rpcUrl] RPC override; defaults to the chain's public RPC
 */
export function createSelfFacilitator({ privateKey, caip2, rpcUrl }) {
  const chain = CHAINS[caip2];
  if (!chain) throw new Error(`self-settlement: unsupported network ${caip2}`);

  const account = privateKeyToAccount(privateKey);
  const client = createWalletClient({
    account,
    chain,
    transport: http(rpcUrl),
  }).extend(publicActions);

  const signer = toFacilitatorEvmSigner(Object.assign(client, { address: account.address }));
  const facilitator = new x402Facilitator().register(
    caip2,
    new ExactEvmFacilitatorScheme(signer)
  );

  return {
    settlerAddress: account.address,
    verify: (payload, requirements) => facilitator.verify(payload, requirements),
    settle: (payload, requirements) => facilitator.settle(payload, requirements),
    getSupported: async () => facilitator.getSupported(),
  };
}
