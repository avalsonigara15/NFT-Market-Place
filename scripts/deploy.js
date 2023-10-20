// Import necessary modules from the Hardhat framework and Node.js standard library
// const { ethers } = require("hardhat");
const hre = require("hardhat");
const fs = require("fs");

// Async function to deploy the NFTMarketplace smart contract and generate its ABI and address
async function main() {
  // Get the factory for the NFTMarketplace smart contract
  const Marketplace = await hre.ethers.getContractFactory("NFTMarketplace");

  // Deploy the NFTMarketplace smart contract
  const marketplace = await Marketplace.deploy();
  await marketplace.deployed();

  //Pull the address and ABI out while you deploy, since that will be key in interacting with the smart contract later
  const data = {
    address: marketplace.address,
    abi: JSON.parse(marketplace.interface.format("json")),
  };

  //This writes the ABI and address to the marketplace.json
  //This data is then used by frontend files to connect with the smart contract
  fs.writeFileSync("./src/Marketplace.json", JSON.stringify(data));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
