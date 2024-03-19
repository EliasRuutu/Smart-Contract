import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    hardhat: {},
    sepolia: {
      url: process.env.SEPOLIA_RPC_INFRA,
      chainId: 11155111,
      gasPrice: 20000000000,
      accounts: [process.env.PRIVATE_KEY!],
    },
    eth_mainnet: {
      url: process.env.ETH_MAINNET_RPC,
      chainId: 1,
      gasPrice: 20000000000,
      accounts: [process.env.PRIVATE_KEY!],
    },
    bsc_testnet: {
      url: process.env.BSC_RPC,
      chainId: 97,
      gasPrice: 20000000000,
      accounts: [process.env.PRIVATE_KEY!],
    },
    bsc_mainnet: {
      url: process.env.BSC_MAINNET_RPC,
      chainId: 56,
      gasPrice: 20000000000,
      accounts: [process.env.PRIVATE_KEY!],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
    // apiKey: process.env.BSCSCAN_API_KEY,
    // apiKey: process.env.POLYGON_API_KEY,
  },
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
          },
        },
      },
      {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
          },
        },
      },
    ],
  },
};

export default config;
