# Farebox — Day Zero Post Pack

Launch day / day after. Everything here is for the first 48 hours, while "it just shipped" is still true. All posts under 280 chars unless marked **longform**. US spelling. No rockets, no "excited to announce," no invented numbers — every figure below is from a real tx or a real gas receipt.

Don't overlap with thread.md (pinned thread) or posts.md (week-two drip). This file is the loud stuff: live money, receipts, firsts.

---

## 1. Launch day singles

### 1a. The dare

There is real money behind this URL right now.

curl -i https://demo.farebox.dev/api/fortune

That's a live HTTP 402 with x402 payment terms, on Base mainnet. Pay $0.005 USDC with any x402 client and you get a fortune back. Go ahead.

### 1b. It's on npm

farebox@0.1.0 is live on npm as of today.

npx farebox --target <your-api> --pay-to 0xYou --price 0.005

Works cold — no install, no account, no config file. One command and your endpoint charges USDC per request. MIT: github.com/sneakbts/farebox

### 1c. Receipts

Day-zero receipts, both mainnet:

Base, real USDC, demo paid twice over the public internet:
0x4243e2160765d086062042c5a97a8ee7ad5b3c9482f112644ee6c91ec7cf9385

Robinhood Chain, real USDG, first x402 payment ever on chain 4663:
0xe38f289cc7eebde6afffc8e0438bf941b7895590066d739dbbe7706acb93b13f

**longform** — the two full hashes push this over 280. Post as a long post, or run the Base tx in the main text and the RH Chain tx as a self-reply.

### 1d. Robinhood Chain post (for the CT / RH ecosystem crowd)

No x402 facilitator serves Robinhood Chain. None. So we broadcast settlement ourselves — and that tx is the first x402 payment in the chain's history. Real USDG, chain 4663, self-settled:

robinhoodchain.blockscout.com → 0xe38f289c…3b13f

Farebox is the only tool that can do this.

Follow-up reply if it gets traction:

> Practically: if you're building on RH Chain, your API can charge USDG per request today. You don't wait for a facilitator to add the chain — your own gas wallet is the facilitator. Gas is ~0.0000022 ETH per settlement.

### 1e. The fee splitter

Farebox's OSS default is feeless. The optional fee path is a contract, not a promise:

FareSplitter — immutable, 10% hard cap baked in, anyone-can-flush, deployed via CREATE2 factory. Live on Base mainnet (0xA7512a6dda2e6F429760a5cfA1C82AC741A6A138), 97/3 split verified on Base Sepolia.

A fee you can't rug.

### 1f. How cheap is settlement, really

Settlement gas per payment, measured today:

Base: ~$0.00001
Robinhood Chain: ~0.0000022 ETH

On a $0.005 fare that's ~0.2% overhead on Base. And the buyer pays none of it — buyers only sign, the seller's wallet broadcasts. Per-request pricing works because the rails cost nothing.

---

## 2. Quote-tweet ammo

For when the relevant news or discourse crosses the timeline. One-two liners; let the quoted post carry the context.

### 2a. On Cloudflare Monetization Gateway news

A waitlist is a pricing signal. Farebox is the no-waitlist version: MIT, self-custodial, fronts anything that speaks HTTP, on npm right now.

### 2b. On AWS x402 news

x402 behind CloudFront is great — if you're behind CloudFront. Farebox is one npx command in front of anything with a URL.

### 2c. On x402 Foundation / standard news

The standard is settled. The tooling should be one command:

npx farebox --target <url> --pay-to 0xYou --price 0.005

### 2d. On "agents will pay for things" discourse

This stopped being a thought experiment today. Our demo endpoint takes real USDC on Base mainnet from any x402 client, $0.005 a request: demo.farebox.dev

---

## 3. Builder log

Build-in-public singles. Post over the first few days, one at a time, whenever the feed is quiet. These are the true war stories — don't embellish them, they're good as-is.

### 3a. The empty wallet

Builder log: payments through the free public testnet facilitator started failing mid-build. Dug into it. The facilitator's gas wallet was empty. The free middleman was literally broke.

That was the moment --settler-key went from idea to requirement.

### 3b. Self-settlement in a day

Self-settlement took one day to write. Verify the signed transfer, broadcast it from your own gas wallet, serve the response. That's it.

The facilitator was never the hard part of x402. It was just the part you had to wait on.

### 3c. The bridge deposit

To pay the first x402 fare on Robinhood Chain we first had to bridge funds in. The deposit reverted at the estimated 200k gas. Actual requirement: 664k.

Gas estimators lie on young chains. Pad hard, retry, move on.

### 3d. Brute-matching the domain

USDG's EIP-712 domain on Robinhood Chain isn't documented anywhere, and signatures kept failing. So: generate candidate domains, hash each, compare against the on-chain DOMAIN_SEPARATOR until one matches.

Ugly. Deterministic. Worked. That's how the first x402 payment on that chain got signed.

### 3e. Copycat USDG

Dozens of tokens on Robinhood Chain share the USDG symbol. We pinned the real one — the $2.6B contract — by address, never by symbol.

If your payment tool resolves tokens by symbol, it doesn't have a bug. It has an exploit with a release date.

---

## 4. Hook variants (pinned post A/B options)

Five alternative openers for the pinned post, each under 200 chars. Swap in whichever lands; the thread body stays the same.

### 4a. Plain capability

Your API can charge real money per request, starting now. One command, no account, no waitlist, no custody. npx farebox

### 4b. The 402 angle

HTTP 402 "Payment Required" has been reserved since 1997. As of today, one npx command finally makes it collect.

### 4c. The dare, compressed

We put $0.005 of real USDC behind a URL on Base mainnet and dared the internet to pay it. It got paid — twice. Here's the tool.

### 4d. The command is the hook

npx farebox --target <url> --pay-to 0xYou --price 0.005

That's the whole product. Your endpoint now charges USDC per request, settled to your wallet.

### 4e. The category line

Per-request payments for machine buyers: a one-command x402 paywall that settles USDC straight to your wallet and never holds a cent. Live on npm today.

---

## Posting notes

- 1a (dare) and 1b (npm) are the day-zero pair — dare in the morning, npm post a few hours later. 1c (receipts) goes out once at least one stranger has paid the demo, as a reply or standalone.
- 1d is for RH Chain / CT accounts and hours; don't post it back-to-back with the pinned thread's RH post.
- Quote-tweet ammo is reactive only. Never force it onto an unrelated post.
- No metrics claims, ever, until there are real ones to screenshot.
