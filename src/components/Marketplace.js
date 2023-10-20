// Import necessary components, JSON data, external libraries, and React hooks
import Navbar from "./Navbar";
import NFTTile from "./NFTTile";
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState } from "react";
import { GetIpfsUrlFromPinata } from "../utils";

/**
 * Renders the Marketplace component which displays the top NFTs.
 */
export default function Marketplace() {
  const [data, updateData] = useState([]); // State variable to store NFT data
  const [dataFetched, updateFetched] = useState(false); // State variable to track whether data has been fetched

  /**
   * Fetches all NFTs from the deployed contract instance and returns their details.
   * @returns {Promise<Array>} An array of objects containing the details of each NFT.
   */
  async function getAllNFTs() {
    // Use ethers.js to interact with the Ethereum blockchain
    const ethers = require("ethers");

    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    // Instantiate the deployed contract instance using its ABI and address from JSON data
    let contract = new ethers.Contract(
      MarketplaceJSON.address,
      MarketplaceJSON.abi,
      signer
    );
    console.log(contract);
    // Call the smart contract function to get all NFTs
    let transaction = await contract.getAllNFTs();

    //Fetch all the details of every NFT from the contract and display
    const items = await Promise.all(
      transaction.map(async (i) => {
        // Get the token URI from the contract and convert IPFS hash to URL
        var tokenURI = await contract.tokenURI(i.tokenId);
        tokenURI = GetIpfsUrlFromPinata(tokenURI);

        // Fetch NFT metadata from IPFS
        let meta = await axios.get(tokenURI);
        meta = meta.data;

        // Format the NFT details into an object
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        console.log(typeof price);
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.image,
          name: meta.name,
          description: meta.description,
        };
        console.log(item);
        return item;
      })
    );

    // Update state variables to store fetched NFT data and indicate data has been fetched
    updateFetched(true);
    updateData(items);
  }

  // Call getAllNFTs() if data has not been fetched yet (component initialization)
  if (!dataFetched) {
    getAllNFTs();
  }
  return (
    <div>
      {/* Navbar component for navigation */}
      <Navbar></Navbar>

      {/* Marketplace content */}
      <div className="flex flex-col place-items-center mt-20">
        <div className="md:text-xl font-bold text-white">Top NFTs</div>
        <div className="flex mt-5 justify-between flex-wrap max-w-screen-xl text-center">
          {data.map((value, index) => {
            return <NFTTile data={value} key={index}></NFTTile>;
          })}
        </div>
      </div>
    </div>
  );
}
