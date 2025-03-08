require("@nomicfoundation/hardhat-toolbox");
require("@hashgraph/sdk");
require("dotenv").config();

const { HEDERA_ACCOUNT_ID, HEDERA_PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.8.20",
  defaultNetwork: "hedera",
  networks: {
    hedera: {
      url: "https://testnet.hashio.io/api", // Hedera Testnet RPC
      accounts: [`0x${HEDERA_PRIVATE_KEY}`], // Use your private key
    },
  },
};
