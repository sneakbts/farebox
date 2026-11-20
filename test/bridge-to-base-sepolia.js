// Bridge Sepolia L1 ETH -> Base Sepolia for the settler wallet.
// Sends ETH to Base Sepolia's L1StandardBridge (address from viem's chain
// definition, not hardcoded); it mints to the same address on L2 in ~1-3 min.
// Usage: node test/bridge-to-base-sepolia.js [amountEth]
import "dotenv/config";
import { createWalletClient, createPublicClient, http, parseEther, formatEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia, baseSepolia } from "viem/chains";

const amount = process.argv[2] || "0.03";
const account = privateKeyToAccount(process.env.SETTLER_PRIVATE_KEY);
const bridge = baseSepolia.contracts.l1StandardBridge[sepolia.id].address;
console.log("settler:", account.address);
console.log("L1StandardBridge (from viem):", bridge);

const l1 = createPublicClient({ chain: sepolia, transport: http("https://ethereum-sepolia-rpc.publicnode.com") });
const wallet = createWalletClient({ account, chain: sepolia, transport: http("https://ethereum-sepolia-rpc.publicnode.com") });

const bal = await l1.getBalance({ address: account.address });
console.log("L1 Sepolia balance:", formatEther(bal), "ETH");
if (bal < parseEther(amount)) {
  console.error(`Not enough L1 ETH to bridge ${amount}`);
  process.exit(1);
}

const hash = await wallet.sendTransaction({
  to: bridge,
  value: parseEther(amount),
  gas: 200000n,
});
console.log("bridge deposit tx:", hash);
await l1.waitForTransactionReceipt({ hash });
console.log("L1 deposit confirmed. Polling Base Sepolia balance...");

const l2 = createPublicClient({ chain: baseSepolia, transport: http("https://sepolia.base.org") });
for (let i = 0; i < 40; i++) {
  const l2bal = await l2.getBalance({ address: account.address });
  console.log(new Date().toISOString(), "Base Sepolia:", formatEther(l2bal), "ETH");
  if (l2bal > 0n) process.exit(0);
  await new Promise((r) => setTimeout(r, 15000));
}
console.error("L2 funds did not arrive within 10 min; check the deposit on sepolia.etherscan.io:", hash);
process.exit(1);
