import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { paymentMiddleware, x402ResourceServer } from "@x402/express";
import { ExactEvmScheme } from "@x402/evm/exact/server";
import { HTTPFacilitatorClient } from "@x402/core/server";
import { resolveNetwork } from "./networks.js";
import { createSelfFacilitator } from "./selfFacilitator.js";

/**
 * Create a Farebox server: an x402 paywall in front of an upstream URL.
 *
 * @param {object} opts
 * @param {string} opts.target     Upstream base URL to protect
 * @param {string} opts.payTo      EVM address that receives payments
 * @param {string} opts.price      Price per request in USD, e.g. "0.01"
 * @param {string} opts.network    "base" | "base-sepolia"
 * @param {string} [opts.facilitator] Facilitator URL override
 * @param {string[]} [opts.routes] Route patterns to charge for (default: everything)
 * @param {string} [opts.description] Human/agent-readable description of the resource
 * @returns {{ app: import("express").Express, network: object }}
 */
export function createFarebox(opts) {
  const network = resolveNetwork(opts.network);
  const price = `$${Number(opts.price)}`;
  const patterns = opts.routes?.length ? opts.routes : ["*"];

  let facilitatorClient;
  let facilitatorUrl;
  if (opts.settlerKey) {
    const self = createSelfFacilitator({
      privateKey: opts.settlerKey,
      caip2: network.caip2,
      rpcUrl: opts.rpcUrl,
    });
    facilitatorClient = self;
    facilitatorUrl = `self-settled by ${self.settlerAddress}`;
  } else {
    facilitatorUrl = opts.facilitator || network.defaultFacilitator;
    if (!facilitatorUrl) {
      throw new Error(
        `${network.label} has no keyless public facilitator. Use --settler-key to self-settle (recommended) or pass --facilitator <url>.`
      );
    }
    facilitatorClient = new HTTPFacilitatorClient({ url: facilitatorUrl });
  }
  const resourceServer = new x402ResourceServer(facilitatorClient).register(
    network.caip2,
    new ExactEvmScheme()
  );

  const routes = {};
  for (const pattern of patterns) {
    routes[pattern] = {
      accepts: [
        {
          scheme: "exact",
          price,
          network: network.caip2,
          payTo: opts.payTo,
        },
      ],
      description:
        opts.description || `Paid access via Farebox (${price}/request)`,
    };
  }

  const app = express();
  app.disable("x-powered-by");

  // Unpaid health endpoint so operators can monitor the farebox itself.
  app.get("/__farebox/health", (_req, res) => {
    res.json({
      ok: true,
      target: opts.target,
      network: network.caip2,
      price,
      payTo: opts.payTo,
      facilitator: facilitatorUrl,
    });
  });

  app.use(paymentMiddleware(routes, resourceServer));

  app.use(
    createProxyMiddleware({
      target: opts.target,
      changeOrigin: true,
      xfwd: true,
    })
  );

  return { app, network, facilitatorUrl, price };
}
