# farebox

**Put a fare on anything.**

Farebox is a one-command [x402](https://x402.org) paywall proxy. Point it at any HTTP API or MCP server, set a price, and every request has to pay a USDC fare on Base — straight to your wallet. No accounts, no API keys, no Stripe, no waitlist.

```bash
npx farebox --target http://localhost:8080 --pay-to 0xYourWallet --price 0.005
```

That's it. Unpaid requests get an HTTP `402 Payment Required` with machine-readable x402 payment terms. Any x402-capable agent or client pays the fare and gets the response. The USDC lands in your wallet, per request.

## Why

Agents can't hold credit cards, and card rails can't do $0.005 transactions. The x402 standard (Coinbase, Cloudflare, AWS, now under a Linux Foundation body) fixes that with HTTP-native stablecoin payments — but the hosted implementations put your resource behind their cloud, their waitlist, and their custody.

Farebox is the permissionless version:

- **Works in front of anything.** A $5 VPS, a localhost tunnel, Railway, a Python script. If it speaks HTTP, it can charge fares.
- **Self-custodial.** Payments settle to the `--pay-to` wallet you control. Farebox never holds funds.
- **Self-settled (optional).** With `--settler-key`, farebox broadcasts the payment transaction itself from your own gas wallet. No third-party facilitator, no API keys, no dependency on anyone's free tier. Gas on Base is a fraction of a cent.
- **Standard, not proprietary.** Speaks x402 v2. Any x402 client — including agents built on Cloudflare's own Agents SDK — can pay a farebox endpoint.

## Install

```bash
npm install -g farebox   # or just use npx
```

## Usage

```
farebox --target <url> --pay-to <address> [options]

  -t, --target <url>        upstream URL to protect (required)
  -w, --pay-to <address>    EVM address that receives payments (required)
  -p, --price <usd>         price per request in USD (default: 0.01)
  -n, --network <network>   base | base-sepolia (default: base)
      --port <port>         port to listen on (default: 4021)
  -r, --route <pattern...>  routes to charge for, e.g. "GET /api/*" (default: everything)
      --facilitator <url>   x402 facilitator URL override
      --settler-key <key>   self-settle from this gas wallet (env: FAREBOX_SETTLER_KEY)
      --rpc-url <url>       RPC override for self-settlement
      --description <text>  description shown to payers in the 402 response
```

### Test on Base Sepolia

```bash
farebox --target http://localhost:8080 --pay-to 0xYou --price 0.005 --network base-sepolia
```

Get testnet USDC for the buyer side from [Circle's faucet](https://faucet.circle.com). Buyers don't need ETH on any network — they only sign; settlement pays the gas.

### Self-settlement (no facilitator)

By default farebox verifies and settles through a public x402 facilitator. Facilitators are third parties: they can be down, gated behind API keys, or (as we found during development) literally out of gas.

```bash
farebox --target http://localhost:8080 --pay-to 0xYou --settler-key 0xGasWalletKey
```

With a settler key, farebox verifies the payment signature locally and broadcasts the USDC `transferWithAuthorization` itself. Fund the gas wallet with a few dollars of ETH on Base and you depend on no one. The settler wallet only pays gas — it never touches the USDC, which moves directly from payer to your `--pay-to` wallet.

### Paying a farebox (buyer side)

```js
import { wrapFetchWithPaymentFromConfig } from "@x402/fetch";
import { ExactEvmScheme } from "@x402/evm";
import { privateKeyToAccount } from "viem/accounts";

const fetchWithPayment = wrapFetchWithPaymentFromConfig(fetch, {
  schemes: [{ network: "eip155:8453", client: new ExactEvmScheme(privateKeyToAccount(KEY)) }],
});
const res = await fetchWithPayment("https://api.example.com/paid-endpoint");
```

## How it works

1. Client requests a protected route → farebox replies `402` with x402 payment requirements (price, asset, recipient, network).
2. Client signs an EIP-3009 USDC `transferWithAuthorization` for the exact amount and retries with the `PAYMENT` header.
3. Farebox verifies the signature and settles it (via facilitator, or itself in self-settle mode). The USDC moves payer → your wallet on-chain.
4. The request is forwarded to your upstream and the response returned with a settlement receipt header.

No custom smart contracts. No custody. Just the x402 standard and the USDC contract.

## Notes

- Settlement happens before the request is forwarded, so a paid request that then hits a 500 from your upstream has still been paid for. Keep your upstream healthy; refunds are between you and your users.
- `/__farebox/health` is unpaid and reports the proxy's configuration.
- MCP servers over HTTP (SSE/streamable) are just HTTP — farebox fronts them like anything else.

## License

MIT
