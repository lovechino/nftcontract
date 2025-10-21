import { ethers } from "ethers";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const wallet = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY, provider);

const nftAddress = "0x22FB726b8f1C1Eef3644B2ee73aA943AF98d2414"; // NFT mới
const marketplaceAddress = "0x6005b3432200D9Ae8ec786e5C7caB06F4429a1E8";

const nftAbi = [
  "function mintNFT(address to, string memory tokenURI) public returns (uint256)",
  "function approve(address to, uint256 tokenId) external",
  "function ownerOf(uint256 tokenId) view returns (address)"
];
const marketAbi = [
  "function listNFT(address nftContract, uint256 tokenId, uint256 price) external"
];

const nft = new ethers.Contract(nftAddress, nftAbi, wallet);
const market = new ethers.Contract(marketplaceAddress, marketAbi, wallet);

const main = async () => {
  console.log("🚀 Minting NFT...");
  const mintTx = await nft.mintNFT(wallet.address, "ipfs://QmABC123xyz");
  const mintReceipt = await mintTx.wait();

  const tokenId = mintReceipt.logs[0].topics[3]
    ? Number(mintReceipt.logs[0].topics[3])
    : 0;
  console.log("✅ Minted NFT ID:", tokenId);

  console.log("🔓 Approving marketplace...");
  const approveTx = await nft.approve(marketplaceAddress, tokenId);
  await approveTx.wait();

  console.log("💰 Listing NFT on marketplace...");
  const listTx = await market.listNFT(nftAddress, tokenId, ethers.parseEther("0.001"));
  await listTx.wait();

  console.log("🎉 NFT listed successfully!");
};

main().catch(console.error);
