#!/usr/bin/env node
import { Command } from "commander";
import { createFarebox } from "../src/proxy.js";
import { NETWORKS } from "../src/networks.js";

const program = new Command();

program
  .name("farebox")
  .description(
    "Put a USDC fare on anything. x402 paywall proxy: agents pay per request, straight to your wallet."
  )
  .requiredOption("-t, --target <url>", "upstream URL to protect")
  .requiredOption("-w, --pay-to <address>", "EVM address that receives payments")
  .option("-p, --price <usd>", "price per request in USD", "0.01")
  .option(
    "-n, --network <network>",
    `network: ${Object.keys(NETWORKS).join(" | ")}`,
    "base"
  )
  .option("--port <port>", "port to listen on", "4021")
  .option(
    "-r, --route <pattern...>",
    'route patterns to charge for, e.g. "GET /api/*" (default: everything)'
  )
  .option("--facilitator <url>", "x402 facilitator URL override")
  .option(
    "--settler-key <0xkey>",
    "self-settle: broadcast payments yourself from this gas wallet (env: FAREBOX_SETTLER_KEY)"
  )
  .option("--rpc-url <url>", "RPC endpoint override for self-settlement")
  .option("--description <text>", "description shown to payers in the 402 response")
  .version("0.1.0");

program.parse();
const opts = program.opts();

if (!/^0x[a-fA-F0-9]{40}$/.test(opts.payTo)) {
  console.error(`farebox: --pay-to "${opts.payTo}" is not a valid EVM address`);
  process.exit(1);
}
const priceNum = Number(opts.price);
if (!Number.isFinite(priceNum) || priceNum <= 0) {
  console.error(`farebox: --price "${opts.price}" is not a positive number`);
  process.exit(1);
}

try {
  const { app, network, facilitatorUrl, price } = createFarebox({
    target: opts.target,
    payTo: opts.payTo,
    price: opts.price,
    network: opts.network,
    facilitator: opts.facilitator,
    settlerKey: opts.settlerKey || process.env.FAREBOX_SETTLER_KEY,
    rpcUrl: opts.rpcUrl,
    routes: opts.route,
    description: opts.description,
  });

  const port = Number(opts.port);
  app.listen(port, () => {
    console.log(`
  ┌─────────────────────────────────────────────┐
  │  farebox is collecting fares                │
  └─────────────────────────────────────────────┘
   upstream     ${opts.target}
   fare         ${price} per request (USDC)
   pay to       ${opts.payTo}
   network      ${network.label} (${network.caip2})
   facilitator  ${facilitatorUrl}
   listening    http://localhost:${port}
`);
  });
} catch (err) {
  console.error(`farebox: ${err.message}`);
  process.exit(1);
}
