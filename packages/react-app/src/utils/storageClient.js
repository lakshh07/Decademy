import { Web3Storage } from "web3.storage";

export default function makeStorageClient() {
  const token = process.env.REACT_APP_WEB3_TOKEN_KEY;
  return new Web3Storage({ token });
}
