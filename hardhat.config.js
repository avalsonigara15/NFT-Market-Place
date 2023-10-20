require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config({ path: __dirname + "/.env" });

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    sepolia: {
      url: process.env.REACT_APP_ALCHEMY_API_URL,
      accounts: [`0x${process.env.REACT_APP_PRIVATE_KEY}`],
    },
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
