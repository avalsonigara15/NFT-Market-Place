import Navbar from "./Navbar";

import { useLocation, useParams } from "react-router-dom";
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState } from "react";
import { GetIpfsUrlFromPinata } from "../utils";

// NFTPage component to display details of a specific NFT and enable purchasing
export default function NFTPage(props) {
  // State variables for managing NFT data, loading status, messages, and user's Ethereum address
  const [data, updateData] = useState({}); // State variable for storing NFT data
  const [dataFetched, updateDataFetched] = useState({}); // State variable to track if NFT data has been fetched
  const [message, updateMessage] = useState(""); // State variable for displaying messages to the user
  const [currAddress, updateCurrAddress] = useState("0x"); // State variable for the user's current Ethereum address

  // Function to fetch and update details of a specific NFT using its tokenId
  async function getNFTData(tokenId) {
    const ethers = require("ethers");
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();
    //Pull the deployed contract instance
    let contract = new ethers.Contract(
      MarketplaceJSON.address,
      MarketplaceJSON.abi,
      signer
    );
    // Fetch NFT details from the contract and its metadata from IPFS
    var tokenURI = await contract.tokenURI(tokenId);
    console.log(tokenURI);
    const listedToken = await contract.getListedTokenForId(tokenId);
    tokenURI = GetIpfsUrlFromPinata(tokenURI);
    let meta = await axios.get(tokenURI);

    meta = meta.data;
    console.log(listedToken);

    // Format the NFT details for display
    let item = {
      price: meta.price,
      tokenId: tokenId,
      seller: listedToken.seller,
      owner: listedToken.owner,
      image: meta.image,
      name: meta.name,
      description: meta.description,
    };

    // Update state variables with fetched NFT data and user's Ethereum address
    updateData(item);
    updateDataFetched(true);
    updateCurrAddress(addr);
  }

  // Function to handle the purchase of the NFT with the given tokenId
  async function buyNFT(tokenId) {
    try {
      const ethers = require("ethers");
      //After adding your Hardhat network to your metamask, this code will get providers and signers
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      //Pull the deployed contract instance
      let contract = new ethers.Contract(
        MarketplaceJSON.address,
        MarketplaceJSON.abi,
        signer
      );
      // Parse the sale price from Ether to Wei
      const salePrice = ethers.utils.parseUnits(data.price, "ether");

      updateMessage("Buying the NFT... Please Wait (Upto 5 mins)");
      // Execute the NFT purchase transaction by calling the smart contract function
      let transaction = await contract.executeSale(tokenId, {
        value: salePrice,
      });
      await transaction.wait(); // Wait for the transaction to be mined and confirmed

      // Display a success message to the user after a successful NFT purchase
      alert("You successfully bought the NFT!");
      updateMessage("");
    } catch (e) {
      alert("Upload Error" + e);
    }
  }

  // Get the tokenId parameter from the URL using React Router's useParams hook
  const params = useParams();
  const tokenId = params.tokenId;

  // Fetch NFT data if it hasn't been fetched yet (component initialization)
  if (dataFetched) getNFTData(tokenId);

  // Ensure that the image URL is a string and handle IPFS URL conversion
  if (typeof data.image == "string")
    data.image = GetIpfsUrlFromPinata(data.image);

  return (
    <div style={{ "min-height": "100vh" }}>
      <Navbar></Navbar>
      <div className="flex ml-20 mt-20 ">
        <img src={data.image} alt="" className="w-2/5 rounded-xl" />
        <div className="text-xl ml-20 space-y-8 text-white shadow-2xl rounded-xl backdrop-blur-lg border-2 p-5">
          <div>Name: {data.name}</div>
          <div>Description: {data.description}</div>
          <div>
            Price: <span className="">{data.price + " ETH"}</span>
          </div>
          <div>
            Owner: <span className="text-sm">{data.owner}</span>
          </div>
          <div>
            Seller: <span className="text-sm">{data.seller}</span>
          </div>
          <div>
            {currAddress !== data.owner && currAddress !== data.seller ? (
              <button
                className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
                onClick={() => buyNFT(tokenId)}
              >
                Buy this NFT
              </button>
            ) : (
              <div className="text-emerald-700">
                You are the owner of this NFT
              </div>
            )}

            <div className="text-green text-center mt-3">{message}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
