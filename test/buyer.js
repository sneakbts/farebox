// E2E buyer: pays the farebox with x402 and prints the result.
// Usage: node test/buyer.js <url> [network]
import "dotenv/config";
import { wrapFetchWithPaymentFromConfig, decodePaymentResponseHeader } from "@x402/fetch";
import { ExactEvmScheme } from "@x402/evm";
import { privateKeyToAccount } from "viem/accounts";

const url = process.argv[2] || "http://localhost:4021/api/fortune";
const caip2 = process.argv[3] || "eip155:84532";

const account = privateKeyToAccount(process.env.BUYER_PRIVATE_KEY);
console.log("buyer wallet:", account.address);

const fetchWithPayment = wrapFetchWithPaymentFromConfig(fetch, {
  schemes: [{ network: caip2, client: new ExactEvmScheme(account) }],
});

// 1. Show the unpaid 402 first
const unpaid = await fetch(url);
console.log("unpaid status:", unpaid.status);
const body = await unpaid.json().catch(() => null);
console.log("402 body:", JSON.stringify(body, null, 2).slice(0, 1200));

// 2. Pay and retry automatically
const res = await fetchWithPayment(url);
console.log("paid status:", res.status);
console.log("response:", JSON.stringify(await res.json()));

const receiptHeader = res.headers.get("PAYMENT-RESPONSE") || res.headers.get("X-PAYMENT-RESPONSE");
if (receiptHeader) {
  const receipt = decodePaymentResponseHeader(receiptHeader);
  console.log("settlement:", JSON.stringify(receipt, null, 2));
} else {
  console.log("no settlement header found; headers:", [...res.headers.keys()].join(", "));
}
