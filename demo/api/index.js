// Farebox live demo: a paid fortune API, deployed on Vercel.
// Same x402 stack as the farebox CLI, mounted directly as middleware.
import express from "express";
import { paymentMiddleware, x402ResourceServer } from "@x402/express";
import { ExactEvmScheme } from "@x402/evm/exact/server";
import { HTTPFacilitatorClient } from "@x402/core/server";
import { createSelfFacilitator } from "../lib/selfFacilitator.js";

const NETWORKS = {
  "base": { caip2: "eip155:8453" },
  "base-sepolia": { caip2: "eip155:84532", facilitator: "https://x402.org/facilitator" },
};

const networkName = process.env.DEMO_NETWORK || "base-sepolia";
const net = NETWORKS[networkName];
const payTo = process.env.DEMO_PAY_TO;
const price = process.env.DEMO_PRICE || "$0.005";

let facilitatorClient;
if (process.env.FAREBOX_SETTLER_KEY) {
  facilitatorClient = createSelfFacilitator({
    privateKey: process.env.FAREBOX_SETTLER_KEY,
    caip2: net.caip2,
    rpcUrl: process.env.DEMO_RPC_URL,
  });
} else {
  facilitatorClient = new HTTPFacilitatorClient({ url: net.facilitator });
}

const resourceServer = new x402ResourceServer(facilitatorClient).register(
  net.caip2,
  new ExactEvmScheme()
);

const app = express();
app.disable("x-powered-by");

app.get("/", (_req, res) => {
  res.json({
    hello: "This is a live farebox demo.",
    paid_endpoint: "/api/fortune",
    price,
    network: net.caip2,
    how: "GET /api/fortune returns 402 with x402 terms; pay with any x402 client (e.g. @x402/fetch).",
  });
});

app.use(
  paymentMiddleware(
    {
      "GET /api/fortune": {
        accepts: [{ scheme: "exact", price, network: net.caip2, payTo }],
        description: `Farebox demo: one fortune, ${price}`,
      },
    },
    resourceServer
  )
);

const fortunes = [
  "The agent that pays for its inputs never gets rate limited.",
  "A fare of $0.005 beats a $29/mo subscription you forgot to cancel.",
  "HTTP 402: reserved in 1997, employed in 2026.",
  "Your API was always worth something. Now it has a price.",
  "Nobody ever chargebacked a transferWithAuthorization.",
];

app.get("/api/fortune", (_req, res) => {
  res.json({
    fortune: fortunes[Math.floor(Math.random() * fortunes.length)],
    paid: true,
    served_at: new Date().toISOString(),
  });
});

export default app;
