# Farebox — Launch Status

Updated: 2026-11-20 (session 1)

**Definition of done:** real paid request on Base mainnet through farebox's own flow, verified end to end; site, brand, and launch content live.

## Proven (verified by execution)

- Name/brand: **Farebox** — farebox.dev available (RDAP), `farebox` free on npm, github.com/farebox unclaimed.
- CLI proxy works: `npx farebox` serves correct x402 v2 `402` responses (verified against local upstream, Base Sepolia terms, exact-scheme, USDC).
- Full x402 handshake on Base Sepolia: buyer signs EIP-3009 via `@x402/fetch`, farebox + facilitator verify ✓. Settlement via the free x402.org facilitator **failed on their side** — their settler wallet (0xd407…f1bf) has ~0 ETH. Not our bug; motivated self-settlement.
- Self-settlement mode (`--settler-key`) implemented and boots; settles pending gas in settler wallet.
- Buyer test wallet funded: 20 USDC on Base Sepolia (Circle faucet) → 0xc390b2f6FD2670C86F21CE4828aE1b203DcE22aA.

## In progress

- Landing site (agent, `site/`).
- X launch content (agent, `launch/`).
- Testnet settler gas: pk910 PoW faucet blocked on a Cloudflare Turnstile **(user click needed)**; after mining Sepolia ETH → bridge to Base Sepolia via L1StandardBridge.

## Blocked on user (batched ask sent)

1. Turnstile click for PoW faucet (testnet gas) — or 0.01 Base Sepolia ETH to settler.
2. Operator revenue wallet address (mainnet).
3. ~$5 ETH on Base mainnet to settler wallet 0xeE7Ed7DE5BeD1320b188DAc5188479bD034Ec10a (at mainnet step).
4. Mainnet proving payment (~$0.05 USDC) — via PayBox approval or $1 USDC to buyer wallet.
5. At launch: farebox.dev purchase, X account creation + sign-in, GitHub publish approval, optional npm publish.

## Not started

- Mainnet E2E proving transaction (needs 2–4).
- Vercel deploy of site; DNS.
- GitHub repo publish; npm publish.
- Hosted live demo endpoint (plan: fortune API behind farebox, on Vercel or Windows server).

## Decisions log

- x402 v2 (`@x402/*` 2.31.0); v1 packages are deprecated.
- Default mainnet path: self-settlement (no CDP account needed). Facilitator URL still supported via `--facilitator`.
- Mainnet default facilitator in `networks.js` currently points at facilitator.x402.rs — **dead (404), replace before launch** with self-settle-required error or a working default.
- No custom smart contracts in MVP. No audit needed (standard libs + USDC only).

## Test wallets (disposable, keys in .env, git-ignored)

- DEMO_OPERATOR 0x3073538Fe90f94AF00F232A1ac8521bc844ed6E9 (demo revenue)
- BUYER 0xc390b2f6FD2670C86F21CE4828aE1b203DcE22aA (20 tUSDC)
- SETTLER 0xeE7Ed7DE5BeD1320b188DAc5188479bD034Ec10a (needs gas)
