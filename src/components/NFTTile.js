import { BrowserRouter as Router, Link } from "react-router-dom";
import { GetIpfsUrlFromPinata } from "../utils";

// NFTTile component for displaying individual NFTs in the marketplace
function NFTTile(data) {
  // Create a new path for the Link component to navigate to the NFT's details page
  const newTo = {
    pathname: "/nftPage/" + data.data.tokenId,
  };

  // Convert IPFS URL using the utility function
  const IPFSUrl = GetIpfsUrlFromPinata(data.data.image);

  return (
    <Link to={newTo}>
      <div className="border-2 ml-12 mt-5 mb-12 flex flex-col items-center rounded-lg w-48 md:w-72 shadow-2xl">
        <img
          src={IPFSUrl}
          alt=""
          className="w-72 h-80 rounded-lg object-cover"
        />
        <div className="text-white w-full p-2 bg-gradient-to-t from-[#454545] to-transparent rounded-lg pt-5 -mt-20">
          <strong className="text-xl">{data.data.name}</strong>
          <p className="display-inline">{data.data.description}</p>
        </div>
      </div>
    </Link>
  );
}

export default NFTTile;
