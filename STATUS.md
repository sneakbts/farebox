# Farebox — Launch Status

Updated: 2026-11-20 (session 1 — LAUNCHED: site live at farebox.dev, repo public; npm + X remain)

**Definition of done:** real paid request on Base mainnet through farebox's own flow, verified end to end; site, brand, and launch content live.

## Proven (verified by execution)

- Name/brand: **Farebox** — farebox.dev available (RDAP), `farebox` free on npm, github.com/farebox unclaimed.
- CLI proxy works: `npx farebox` serves correct x402 v2 `402` responses (verified against local upstream, Base Sepolia terms, exact-scheme, USDC).
- Full x402 handshake on Base Sepolia: buyer signs EIP-3009 via `@x402/fetch`, farebox + facilitator verify ✓. Settlement via the free x402.org facilitator **failed on their side** — their settler wallet (0xd407…f1bf) has ~0 ETH. Not our bug; motivated self-settlement.
- Self-settlement mode (`--settler-key`) implemented and boots; settles pending gas in settler wallet.
- Buyer test wallet funded: 20 USDC on Base Sepolia (Circle faucet) → 0xc390b2f6FD2670C86F21CE4828aE1b203DcE22aA.

- **TESTNET E2E COMPLETE (self-settled):** buyer paid $0.005 via @x402/fetch, farebox verified + broadcast settlement itself from the settler wallet. Tx 0xc4d8979f… (Base Sepolia, success). Buyer 20→19.995 USDC, operator 0→0.005. Gas per settlement ≈ 0.0000006 ETH.
- **FareSplitterFactory deployed** to Base Sepolia: 0x4989BAA77CF9FF313c8FE9e8ab79f4035C796E99 (deploy tx by settler). Splitter created at 0xDe35C5B8Fe6533cdE7f47AB51A6760a284D0Fc3D (demo operator / revenue wallet / 300 bps).
- **Live fee split verified on-chain:** $0.10 fare → split tx 0xeedfb992… → operator +0.097, revenue wallet +0.003 (exactly 3%).
- **Public demo live:** https://farebox-demo.vercel.app (402 on /api/fortune) — paid over the public internet by a real x402 client, settlement tx 0xc76a3bfc… success.
- Bridged 0.05 SepETH → Base Sepolia settler (first attempt reverted at 200k gas; estimate+30% buffer = 664k worked — recorded as engineering note).

- **MAINNET PROVEN (real money, 2026-11-20):** the live public demo (farebox-demo.vercel.app, eip155:8453, payTo = Robert's revenue wallet) was paid twice with real USDC by an x402 client over the public internet. Revenue wallet 0 → 0.01 USDC; buyer 1 → 0.99. Second settlement tx: 0x4243e2160765d086062042c5a97a8ee7ad5b3c9482f112644ee6c91ec7cf9385 (Base, success). Settled by our own settler (self-settlement); gas used so far ~0.00003 ETH.
- **FareSplitterFactory on Base mainnet:** 0xA7512a6dda2e6F429760a5cfA1C82AC741A6A138.
- **ROBINHOOD CHAIN PROVEN LIVE (2026-11-20):** real USDG fare paid and self-settled on chain 4663 — settlement tx 0xe38f289cc7eebde6afffc8e0438bf941b7895590066d739dbbe7706acb93b13f (success, block 119188171). Revenue wallet +0.005 USDG, buyer 5→4.995, settler gas used ~0.0000022 ETH. To our knowledge the first x402 payment on Robinhood Chain. Implementation detail: chain 4663 added as `--network robinhood`. No USDC there; native stablecoin USDG (0x5fc5360D…1d168, the $2.6B real one among copycats) verified on-chain to support EIP-3009; EIP-712 domain brute-matched {name "Global Dollar", version "1"}. Farebox emits correct 402 terms (5000 atomic USDG) and Base regression still settles. No facilitator serves RH Chain → self-settle only, which only Farebox does. Live proof needs: small ETH gas on RH Chain to settler + a few USDG to buyer wallet.

## In progress

- (nothing — all unblocked work done)

## Blocked on user (mainnet + launch)

1. ~~ETH/USDC funding~~ ✓ received and spent as intended.
2. At launch: farebox.dev purchase; X account + sign-in; GitHub publish OK; optional npm login; Vercel protection-off OK; Higgsfield credit top-up for final videos.

## Launched 2026-11-20

- **https://farebox.dev LIVE** (+ www; demo at https://demo.farebox.dev and farebox-demo.vercel.app, Base mainnet).
- **GitHub public: https://github.com/sneakbts/farebox** (main, full history).

## Remaining

- ~~npm publish~~ ✓ **farebox@0.1.0 live on npm** (published by Robert with 2FA, 2026-11-20). `npx farebox --version` verified from cold install.
- X: Robert creates @fareboxdev + signs into browser pane; thread ready (update post for RH Chain first before posting).
- Final-quality Higgsfield renders (needs credits).

- farebox.dev DNS + production site cutover (site is deployed, SSO-gated, project "site").
- GitHub repo publish; npm publish.
- X account content posting.
- Final-quality Higgsfield renders (needs credits).

## Decisions log

- x402 v2 (`@x402/*` 2.31.0); v1 packages are deprecated.
- Default mainnet path: self-settlement (no CDP account needed). Facilitator URL still supported via `--facilitator`.
- Mainnet default facilitator in `networks.js` currently points at facilitator.x402.rs — **dead (404), replace before launch** with self-settle-required error or a working default.
- No custom smart contracts in MVP. No audit needed (standard libs + USDC only).

## Test wallets (disposable, keys in .env, git-ignored)

- DEMO_OPERATOR 0x3073538Fe90f94AF00F232A1ac8521bc844ed6E9 (demo revenue)
- BUYER 0xc390b2f6FD2670C86F21CE4828aE1b203DcE22aA (20 tUSDC)
- SETTLER 0xeE7Ed7DE5BeD1320b188DAc5188479bD034Ec10a (needs gas)
