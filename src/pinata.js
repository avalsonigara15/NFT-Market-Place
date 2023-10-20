require("dotenv").config();
const key = process.env.REACT_APP_PINATA_KEY;
const secret = process.env.REACT_APP_PINATA_SECRET;

const axios = require("axios");
const FormData = require("form-data");

// Function to upload JSON data to IPFS using Pinata API
export const uploadJSONToIPFS = async (JSONBody) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`; // Pinata API endpoint for pinning JSON to IPFS

  // Making a POST request to Pinata API to pin JSON data to IPFS
  return axios
    .post(url, JSONBody, {
      headers: {
        pinata_api_key: key, // Set Pinata API key in the request headers
        pinata_secret_api_key: secret, // Set Pinata secret API key in the request headers
      },
    })
    .then(function (response) {
      return {
        success: true,
        pinataURL:
          "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash, // IPFS URL of the pinned JSON data
      };
    })
    .catch(function (error) {
      console.log(error);
      return {
        success: false,
        message: error.message,
      };
    });
};

// Function to upload a file to IPFS using Pinata API
export const uploadFileToIPFS = async (file) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  // Creating FormData object to handle file and metadata for pinning
  let data = new FormData();
  data.append("file", file); // Append the file to the FormData object

  const metadata = JSON.stringify({
    name: "testname",
    keyvalues: {
      exampleKey: "exampleValue",
    },
  });
  data.append("pinataMetadata", metadata);

  // Metadata for the pinned file (example metadata included here)
  const pinataOptions = JSON.stringify({
    cidVersion: 0,
    customPinPolicy: {
      regions: [
        {
          id: "FRA1",
          desiredReplicationCount: 1,
        },
        {
          id: "NYC1",
          desiredReplicationCount: 2,
        },
      ],
    },
  });
  data.append("pinataOptions", pinataOptions);

  // Making a POST request to Pinata API to pin the file to IPFS
  return axios
    .post(url, data, {
      maxBodyLength: "Infinity",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        pinata_api_key: key,
        pinata_secret_api_key: secret,
      },
    })
    .then(function (response) {
      // Return success response with IPFS URL after pinning is successful
      console.log("image uploaded", response.data.IpfsHash);
      return {
        success: true,
        pinataURL:
          "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash, // IPFS URL of the pinned file
      };
    })
    .catch(function (error) {
      console.log(error);
      return {
        success: false,
        message: error.message,
      };
    });
};
