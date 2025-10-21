import type { HardhatUserConfig } from "hardhat/config";
import * as dotenv from "dotenv";
import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import { configVariable } from "hardhat/config";

import "@nomicfoundation/hardhat-ethers";

dotenv.config();

const { SEPOLIA_RPC_URL, SEPOLIA_PRIVATE_KEY } = process.env;
console.log(SEPOLIA_RPC_URL)
if (!SEPOLIA_RPC_URL || !SEPOLIA_PRIVATE_KEY) {
  throw new Error("⚠️ Missing environment variables in .env file!");
}

const config: HardhatUserConfig = {
  plugins: [hardhatToolboxViemPlugin],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      url: SEPOLIA_RPC_URL,
      accounts: [SEPOLIA_PRIVATE_KEY],
    },
  },
};

export default config;
