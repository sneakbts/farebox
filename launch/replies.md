# Farebox — Reply Templates

Short, factual, non-defensive. Pick the variant that fits the tone of the question. Every reply is under 280 chars. Don't copy-paste verbatim twice in the same thread — vary wording.

---

## "Why not just Stripe?"

> Stripe is great for humans with credit cards. Farebox is for machine buyers: an agent pays $0.005 in USDC, the transfer settles on Base, the request goes through. No checkout page, no account for the buyer, no minimum that makes half-cent requests pointless.

Shorter variant:

> Different buyer. Stripe assumes a human with a card. x402 assumes an agent with a wallet paying half a cent per request. Try running a $0.005 charge through card rails.

---

## "Isn't this what Cloudflare does?"

> Same standard (x402), different posture. Cloudflare's Monetization Gateway is waitlist-only, pairs with custodial wallets, and fronts things behind Cloudflare. Farebox is MIT, self-custodial, fronts anything that speaks HTTP, and you can run it right now with one npx command.

Shorter variant:

> Yes — they validated the market. Farebox is the permissionless version: no waitlist, no custody, works in front of anything, open source.

---

## "What about chargebacks?"

> There are none. The USDC transfer settles before the response is served — payment is final, then the request goes through. No disputes, no clawbacks, no 90-day reserve. That's most of the reason to use crypto rails for per-request pricing.

Shorter variant:

> None. Payment settles before the response is served. Final means final.

---

## "Which chains?"

> Base, with USDC, via the x402 standard. Settlement there is sub-cent gas, which is what makes per-request pricing work.

If pushed on "why not X chain":

> Farebox follows the x402 standard, and we ship what we run: USDC on Base today. It's MIT — the repo is open if you want to take a swing at other networks.

(Don't promise other chains. "What we ship today" is the only claim.)

---

## "Is it audited?"

> There's nothing to audit in the usual sense: no custom smart contracts, no custody. Farebox is a proxy plus the standard x402 libraries. The USDC transfer goes buyer → your wallet; Farebox verifies and forwards. The code is MIT and short — read it: github.com/sneakbts/farebox

Shorter variant:

> It's a proxy, not a protocol. No custom contracts, no funds held, standard x402 libs. The whole thing is readable in one sitting: github.com/sneakbts/farebox

---

## "Does the buyer need ETH for gas?"

> No. Buyers just sign the USDC transfer. With --settler-key, Farebox broadcasts it from your own sub-cent-gas wallet on Base — no facilitator, no API key, no account.

---

## "What's a facilitator and why do you avoid one?"

> In the standard x402 flow, a facilitator service broadcasts the settlement. We pointed at the free public testnet one during development and it was out of gas — literally broke. So Farebox can settle its own payments (--settler-key). One less dependency, zero third parties.

---

## "Do you take a cut?"

> No. USDC goes straight from the buyer to your wallet on every request. Farebox never touches funds — there's no balance with us to take a cut from.

---

## General notes

- Never claim user counts, revenue, or testimonials. There are none yet and we don't fake them.
- When someone reports a bug or interop issue with an x402 client, reply asking them to open a GitHub issue and link the repo. In public, always.
- If someone asks a question these templates don't cover (legal, tax, "is this a security"), don't improvise — "not our lane, talk to a professional" and move on.
