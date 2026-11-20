# Farebox — Launch Thread (11 posts)

Voice: builder. Concrete, a little dry, confident. No rocket emojis, no "excited to announce."
All posts under 280 chars unless noted. Media placeholders marked inline.

---

## Post 1

Any HTTP API you run can now charge USDC per request. One command:

npx farebox --target http://localhost:8080 --pay-to 0xYourWallet --price 0.005

No account. No API key. No facilitator. Money goes straight to your wallet.

Open source, MIT. Here's how it works.

---

## Post 2

Farebox is a proxy that speaks x402, the open standard for HTTP-native payments.

Unpaid request → HTTP 402 with payment terms. Client signs a USDC transfer on Base, retries, payment verifies, request passes through to your server.

That's the whole product.

[media: diagram — client → Farebox (402 → pay → 200) → your server]

---

## Post 3

It works in front of anything that speaks HTTP: a REST API, an MCP server, a Python script behind a localhost tunnel, a $5 VPS.

Agents pay with standard x402 clients like @x402/fetch. Buyers just sign a USDC transfer — they don't need ETH for gas.

[media: terminal GIF — npx farebox starts, a paid request goes through, USDC lands in the wallet]

---

## Post 4

Context on why now.

Cloudflare just announced its Monetization Gateway — an x402 stablecoin paywall for things behind Cloudflare — plus custodial agent Wallets. AWS shipped x402 support in CloudFront.

The standard is real. The biggest infra companies are building on it.

---

## Post 5

They validated the market. x402 is how agents will pay for APIs.

But Cloudflare's gateway is waitlist-only, its wallets custodial, and it only fronts things behind Cloudflare.

Farebox is the permissionless version: in front of anything, self-custodial, usable today.

---

## Post 6

About "permissionless." While building this we hit a wall: the standard x402 flow routes settlement through a facilitator service. We pointed at the free public testnet one and payments started failing.

The facilitator's gas wallet was empty. The "free" facilitator was broke.

---

## Post 7

So we made Farebox settle its own payments.

Pass --settler-key and it broadcasts the USDC transfer itself from your own sub-cent-gas wallet on Base.

No third-party facilitator. No API key. No account. No waitlist. Nothing sits between the buyer's signature and your wallet.

---

## Post 8

What Farebox doesn't do also matters:

- It never touches funds. USDC moves buyer → your wallet, per request.
- No custom smart contracts. It's a proxy plus the standard x402 libraries.
- No custody, no balance to withdraw, no dashboard holding your money.

---

## Post 9

Proof self-settlement matters: Robinhood Chain has no x402 facilitator. Not Coinbase's, not anyone's. So farebox settled its own.

Earlier today: the first x402 payment on Robinhood Chain. A real USDG fare, settled on-chain.

https://robinhoodchain.blockscout.com/tx/0xe38f289cc7eebde6afffc8e0438bf941b7895590066d739dbbe7706acb93b13f

---

## Post 10

Things you can put a fare on this afternoon:

- an MCP server, so agents pay per tool call
- a scraper or data API you've been running for free
- the LLM endpoint on your side project
- that one internal script people keep asking to hit

If it speaks HTTP, it can charge.

---

## Post 11

Put a fare on anything.

Site: https://farebox.dev
Code: https://github.com/sneakbts/farebox

MIT licensed. Issues and PRs welcome — especially x402 client interop reports.

npx farebox --target http://localhost:8080 --pay-to 0xYourWallet --price 0.005

[media: screenshot — farebox.dev landing page]

---

## Posting notes

- Post 9 (Robinhood Chain first) is the quote-tweet bait; expect it to travel on its own.
- Post 1 gets pinned (or use the standalone pin in profile.md).
- Attach the terminal GIF to post 3 even if it also goes on the pin — it's the proof.
- "@x402/fetch" in post 3 is an npm package name, not an X mention; X will not link it, which is fine.
- Space nothing out; post the thread in one sitting.
