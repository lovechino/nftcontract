import { ethers } from 'ethers';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Lấy đường dẫn tuyệt đối tới thư mục dự án
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const wallet = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY, provider);

// ABI rút gọn, chỉ cần hàm mintNFT thôi
const abi = [
  'function mintNFT(address recipient, string memory tokenURI) public returns (uint256)'
];

const nftAddress = "0x3F0f115B530DFdC73108Ce4f6ccBf97289DcA8EE";
const nft = new ethers.Contract(nftAddress, abi, wallet);

const main = async () => {
  console.log('🚀 Minting NFT...');
  const tx = await nft.mintNFT(wallet.address, 'ipfs://QmABC123xyz');
  console.log('✅ Tx sent:', tx.hash);

  const receipt = await tx.wait();
  console.log('🎉 Minted! Block:', receipt.blockNumber);
};

main().catch(console.error);


