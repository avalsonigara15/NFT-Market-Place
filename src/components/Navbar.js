import fullLogo from "../full_logo.png";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";

// Navbar component for displaying navigation links and wallet connection status
function Navbar() {
  // State variables for managing wallet connection status and current Ethereum address
  const [connected, toggleConnect] = useState(false); // State variable for wallet connection status
  const location = useLocation(); // Get the current URL using React Router's useLocation hook
  const [currAddress, updateAddress] = useState("0x"); // State variable for current Ethereum address

  // Function to get the connected Ethereum address
  async function getAddress() {
    const ethers = require("ethers");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const addr = await signer.getAddress(); // Get the Ethereum address of the connected user
    updateAddress(addr); // Update the state variable with the fetched address
  }

  // Function to update the wallet connection button UI after connecting
  function updateButton() {
    const ethereumButton = document.querySelector(".enableEthereumButton");
    ethereumButton.textContent = "Connected";
    ethereumButton.classList.remove("hover:bg-blue-70");
    ethereumButton.classList.remove("bg-blue-500");
    ethereumButton.classList.add("hover:bg-green-70");
    ethereumButton.classList.add("bg-green-500");
  }

  // Function to connect the website to the user's Ethereum wallet
  async function connectWebsite() {
    await window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then(() => {
        updateButton();
        console.log("here");
        getAddress();
        window.location.replace(location.pathname);
      });
  }

  // Effect hook to run logic after the component is mounted or when state variables change
  useEffect(() => {
    if (window.ethereum === undefined) return; // If Ethereum provider is not available, return
    let val = window.ethereum.isConnected(); // Check if the user is connected to an Ethereum provider
    if (val) {
      console.log("here");
      getAddress(); // If connected, fetch the Ethereum address
      toggleConnect(val); // Update the connected state variable
      updateButton(); // Update the wallet connection button UI
    }

    // Event listener for changes in connected Ethereum accounts
    window.ethereum.on("accountsChanged", function (accounts) {
      window.location.replace(location.pathname); // Reload the current URL on account change
    });
  }, [toggleConnect]);
  return (
    <div className="">
      <nav className="w-screen">
        <ul className="flex items-end justify-between py-3 bg-transparent text-white ">
          <li className="flex items-end ml-5 pb-2">
            <Link to="/">
              <img
                src={fullLogo}
                alt=""
                width={120}
                height={120}
                className="inline-block -mt-2"
              />
            </Link>
          </li>
          <li className="w-2/6">
            <ul className="lg:flex justify-between font-bold mr-10 text-lg">
              {location.pathname === "/" ? (
                <li className="border-b-2 hover:pb-0 p-2 bg">
                  <Link to="/">Marketplace</Link>
                </li>
              ) : (
                <li className="hover:border-b-2 hover:pb-0 p-2">
                  <Link to="/">Marketplace</Link>
                </li>
              )}
              {location.pathname === "/sellNFT" ? (
                <li className="border-b-2 hover:pb-0 p-2">
                  <Link to="/sellNFT">List My NFT</Link>
                </li>
              ) : (
                <li className="hover:border-b-2 hover:pb-0 p-2">
                  <Link to="/sellNFT">List My NFT</Link>
                </li>
              )}
              {location.pathname === "/profile" ? (
                <li className="border-b-2 hover:pb-0 p-2">
                  <Link to="/profile">Profile</Link>
                </li>
              ) : (
                <li className="hover:border-b-2 hover:pb-0 p-2">
                  <Link to="/profile">Profile</Link>
                </li>
              )}
              <li>
                <button
                  className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4  text-sm rounded-lg"
                  onClick={connectWebsite}
                >
                  {connected ? "Connected" : "Connect Wallet"}
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
      <div className="text-white text-bold text-right mr-10 text-sm">
        {currAddress !== "0x"
          ? "Connected to"
          : "Not Connected. Please login to view NFTs"}{" "}
        {currAddress !== "0x" ? currAddress.substring(0, 15) + "..." : ""}
      </div>
    </div>
  );
}

export default Navbar;
