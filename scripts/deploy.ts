import { ethers } from "ethers";
import * as fs from "fs";
import * as dotenv from "dotenv";
dotenv.config();

// 📌 Cấu hình môi trường từ .env

const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const wallet = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY!, provider);

async function main() {
  console.log("🚀 Deploying contracts with account:", wallet.address);
  console.log("💰 Account balance:", ethers.formatEther(await provider.getBalance(wallet.address)), "ETH");

  // --- Deploy SnapToken ---
  const snapTokenArtifact = JSON.parse(fs.readFileSync("./artifacts/contracts/SnapToken.sol/SnapToken.json", "utf8"));
  const SnapToken = new ethers.ContractFactory(snapTokenArtifact.abi, snapTokenArtifact.bytecode, wallet);
  const snapToken = await SnapToken.deploy();
  await snapToken.waitForDeployment();
  console.log("✅ SnapToken deployed to:", await snapToken.getAddress());

  // --- Deploy SnapNFT ---
  const snapNFTArtifact = JSON.parse(fs.readFileSync("./artifacts/contracts/SnapNFT.sol/SnapNFT.json", "utf8"));
  const SnapNFT = new ethers.ContractFactory(snapNFTArtifact.abi, snapNFTArtifact.bytecode, wallet);
  const snapNFT = await SnapNFT.deploy();
  await snapNFT.waitForDeployment();
  console.log("✅ SnapNFT deployed to:", await snapNFT.getAddress());

  // --- Deploy Marketplace ---
  const marketplaceArtifact = JSON.parse(fs.readFileSync("./artifacts/contracts/Marketplace.sol/Marketplace.json", "utf8"));
  const Marketplace = new ethers.ContractFactory(marketplaceArtifact.abi, marketplaceArtifact.bytecode, wallet);
  const marketplace = await Marketplace.deploy();
  await marketplace.waitForDeployment();
  console.log("✅ Marketplace deployed to:", await marketplace.getAddress());
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
