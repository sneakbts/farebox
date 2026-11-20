# Farebox — Follow-up Posts (two weeks post-launch)

10 standalone drafts. Order is a suggestion; space them out, don't post daily. All under 280 chars unless marked **longform**. [media] placeholders where a visual pulls weight.

---

## 1. Use case: charge for an MCP server

Your MCP server is an API. Agents are the clients. There's no reason tool calls have to be free.

npx farebox --target http://localhost:3000 --pay-to 0xYou --price 0.005

Every tool call now costs half a cent in USDC, paid to your wallet before the call runs.

[media: terminal GIF — agent calls a Farebox-fronted MCP tool, pays, gets the result]

---

## 2. Use case: meter a scraper API

That scraper you run for three friends is an API with a hosting bill.

Put Farebox in front of it. Each request costs a fraction of a cent in USDC, settled to your wallet before the response is served. No invoices, no Stripe account, no "I'll Venmo you."

---

## 3. Use case: put a fare on your side project's LLM endpoint

Side projects with LLM endpoints die of inference costs.

Fix: make each request pay its own way. Farebox fronts the endpoint, charges USDC per request on Base, and the money lands in your wallet. The project funds itself or it doesn't — either way you stop paying.

---

## 4. Explainer: how x402 actually works in 5 lines

x402 in 5 lines:

1. Client calls your API
2. Server replies 402 + payment terms
3. Client signs a USDC transfer for that amount
4. Transfer settles on Base
5. Client retries with proof, gets the response

HTTP has had a 402 status code since 1997. Now it does something.

---

## 5. Comparison post (**longform** — exceeds 280, post as a long post or image)

Three ways to put an x402 paywall on an API right now:

**Cloudflare Monetization Gateway.** x402 paywall for things behind Cloudflare, paired with custodial agent Wallets. Waitlist-only today.

**AWS CloudFront.** x402 support shipped — if your API is behind CloudFront.

**Farebox.** One npx command, in front of anything that speaks HTTP: a $5 VPS, a localhost tunnel, a Python script. Self-custodial — USDC settles straight to your wallet, and with --settler-key there's no facilitator at all. MIT open source. Usable today.

Cloudflare and AWS proved the demand is real. Farebox is the version that doesn't ask permission.

[media: simple 3-column comparison table image]

---

## 6. What we'd build next

Things we want in Farebox next, in rough order:

- per-route pricing (cheap reads, pricier writes)
- a local receipts log you can grep
- config file for people who hate long flags

It's MIT — if one of these is your itch, the repo is open. github.com/sneakbts/farebox

---

## 7. The broke facilitator, retold

Why --settler-key exists: during development, payments through the free public testnet facilitator started failing. Its gas wallet was empty. The "free" facilitator was broke.

So Farebox broadcasts the USDC transfer itself: your wallet, sub-cent gas on Base, no middleman.

---

## 8. Self-custody, stated plainly

Farebox never touches funds. Not "we're non-custodial (terms apply)" — architecturally never.

The buyer signs a USDC transfer to your address. Farebox verifies it and proxies the request. There's no balance with us, nothing to withdraw, nothing to freeze.

---

## 9. Buyers don't need ETH

Underrated part of x402: the buyer just signs.

A client paying a Farebox-fronted API signs a USDC transfer — no ETH for gas, no bridging, no wallet funding ritual. With --settler-key, gas comes from the seller's own sub-cent-gas wallet on Base.

One signature, one request.

---

## 10. Works in front of anything

"Works in front of anything" is literal.

Farebox is a proxy. The thing behind it can be a $5 VPS, a Python script, an MCP server, localhost through a tunnel. If it answers HTTP, it can charge USDC per request.

No platform to be inside of. That's the point.
