import { ethers } from "ethers";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

// --- Config ---
if (!process.env.SEPOLIA_PRIVATE_KEY) {
  throw new Error("❌ Missing PRIVATE_KEY in .env file");
}
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const wallet = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY, provider);

// --- Contract info ---
const SNAP_NFT_ADDRESS = "0x3F0f115B530DFdC73108Ce4f6ccBf97289DcA8EE"; // địa chỉ NFT của bạn
const abi = JSON.parse(fs.readFileSync("./artifacts/contracts/SnapNFT.sol/SnapNFT.json", "utf8")).abi;

async function main() {
  console.log("🪙 Minting NFT with:", wallet.address);

  const contract = new ethers.Contract(SNAP_NFT_ADDRESS, abi, wallet);

  // Metadata URL (IPFS)
  const tokenURI = "ipfs://your-json-metadata-url";

  // Gọi hàm mint
  const tx = await contract.mint(wallet.address, tokenURI);
  console.log("⏳ Minting... waiting for confirmation");

  const receipt = await tx.wait();
  console.log("✅ Minted! TX Hash:", receipt.hash);
}

main().catch(console.error);
