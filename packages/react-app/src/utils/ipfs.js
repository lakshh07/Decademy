import { create } from "ipfs-http-client";
import makeStorageClient from "./storageClient";
import { NFTStorage } from "nft.storage";

export const client = new NFTStorage({
  token: process.env.REACT_APP_NFT_STORAGE_TOKEN,
});

const clientt = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

const clien2 = makeStorageClient();

export const getTextFromIPFS = async (url) => {
  const response = await fetch(url);
  if (response.ok) {
    const text = await response.text();
    return text;
  }
  return "";
};

export const newUploadMarkdownData = async (text) => {
  const file = new File([text], "text.txt", { type: "text/plain" });
  try {
    const added = await clientt.add(file);
    const url = `https://ipfs.infura.io/ipfs/${added.path}`;
    console.log(url);
    return url;
  } catch (error) {
    console.log("Error uploading file: ", error);
  }
  return "";
};

export const uploadToIpfs = async (file) => {
  try {
    const added = await clientt.add(file);
    const url = `https://ipfs.infura.io/ipfs/${added.path}`;
    console.log(url);
    return url;
  } catch (error) {
    console.log("Error uploading file: ", error);
  }
};

export const uploadToIpfss = async (file) => {
  try {
    // const ipfs = await IPFS.create();
    const cid = await client.storeBlob(file);
    const url = `https://nftstorage.link/ipfs/${cid.toString()}`;
    console.log(url);
    return url;
  } catch (error) {
    console.log("Error uploading file: ", error);
  }
};
export const uploadJson = async (file) => {
  try {
    // const ipfs = await IPFS.create();
    const cid = await client.store(file);
    const url = `https://nftstorage.link/ipfs/${cid.toString()}`;
    console.log(url);
    return url;
  } catch (error) {
    console.log("Error uploading file: ", error);
  }
};
