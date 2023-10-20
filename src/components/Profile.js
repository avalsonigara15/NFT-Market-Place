import Navbar from "./Navbar";
import { useLocation, useParams } from "react-router-dom";
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState } from "react";
import NFTTile from "./NFTTile";

// Profile component to display user's wallet address, NFT count, total value, and owned NFTs
export default function Profile() {
  const [data, updateData] = useState([]); // Array to store user's NFT data
  const [address, updateAddress] = useState("0x"); // Variable to store user's wallet address
  const [totalPrice, updateTotalPrice] = useState("0"); // Variable to store the total value of user's NFTs
  const [dataFetched, updateFetched] = useState(false); // Boolean variable indicating whether user data has been fetched

  // Async function to fetch and update user's NFT data from the smart contract
  async function getNFTData(tokenId) {
    const ethers = require("ethers");
    let sumPrice = 0; // Variable to calculate the total value of user's NFTs

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

    // Call the getMyNFTs function from the smart contract to retrieve user's NFT data
    let transaction = await contract.getMyNFTs();

    // Process and format the fetched data to create an array of objects containing NFT details
    const items = await Promise.all(
      transaction.map(async (i) => {
        const tokenURI = await contract.tokenURI(i.tokenId); // Get the token URI from the smart contract
        let meta = await axios.get(tokenURI); // Fetch metadata associated with the token URI
        meta = meta.data; // Extract metadata object from the response

        // Format NFT details into an object
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.image,
          name: meta.name,
          description: meta.description,
        };
        sumPrice += Number(price); // Add NFT price to the total value
        return item; // Return the formatted NFT details object
      })
    );

    // Update state variables with fetched data and set dataFetched to true
    updateData(items); // Update user's NFT data array
    updateFetched(true); // Set dataFetched to true to indicate data has been fetched
    updateAddress(addr); // Update user's wallet address in the state
    updateTotalPrice(sumPrice.toPrecision(3)); // Update the total value of user's NFTs in the state
  }

  const params = useParams(); // Retrieve route parameters
  const tokenId = params.tokenId; // Extract the tokenId parameter from the route

  // If user data has not been fetched, call the getNFTData function with the retrieved tokenId
  if (!dataFetched) getNFTData(tokenId);
  return (
    <div className="profileClass" style={{ "min-height": "100vh" }}>
      <Navbar></Navbar>
      <div className="profileClass ">
        <div className="flex text-center flex-col mt-11 md:text-2xl text-white ">
          <div className="mb-5 ">
            <h2 className="font-bold">Wallet Address</h2>
            {address}
          </div>
        </div>
        <div className="flex flex-row text-center justify-center mt-10 md:text-2xl text-white">
          <div>
            <h2 className="font-bold">No. of NFTs</h2>
            {data.length}
          </div>
          <div className="ml-20">
            <h2 className="font-bold">Total Value</h2>
            {totalPrice} ETH
          </div>
        </div>
        <div className="flex flex-col text-center items-center mt-11 text-white">
          <h2 className="font-bold">Your NFTs</h2>
          <div className="flex justify-center flex-wrap max-w-screen-xl">
            {data.map((value, index) => {
              return <NFTTile data={value} key={index}></NFTTile>;
            })}
          </div>
          <div className="mt-10 text-xl">
            {data.length === 0
              ? "Oops, No NFT data to display (Are you logged in?)"
              : ""}
          </div>
        </div>
      </div>
    </div>
  );
}
