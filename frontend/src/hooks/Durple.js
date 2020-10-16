// Durple Hooks
import React, { useState, useRef, useEffect, createContext, useContext } from "react";
import { ethers } from "ethers";

import SubArtifact from "../contracts/Sub.json";
import contractAddress from "../contracts/contract-address.json";

// This is the Buidler EVM network id, you might change it in the buidler.config.js
// Here's a list of network ids https://docs.metamask.io/guide/ethereum-provider.html#properties
// to use when deploying to other networks.
const BUIDLER_EVM_NETWORK_ID = '31337';

// This is an error code that indicates that the user canceled a transaction
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

const DurpleContext = createContext({
  subData: {
    name: "the durple zone",
    postCount: 0,
    posts: [],
  },
  selectedAddress: undefined,
  txBeingSent: undefined,
  transactionError: undefined,
  networkError: undefined,

  connectWallet: () => {},
  dismissNetworkError: () => {},
  dismissTransactionError: () => {},
  getRpcErrorMessage: () => {},
});

export function useDurpleContext() {
  return useContext(DurpleContext);
}

export function DurpleProvider({children}) {
  // STATE
  const [subData, setSubData] = useState(undefined);
  const [selectedAddress, setSelectedAddress] = useState(undefined);
  // The ID about transactions being sent, and any possible error with them
  const [txBeingSent, setTxBeingSent] = useState(undefined);
  const [transactionError, setTransactionError] = useState(undefined);
  const [networkError, setNetworkError] = useState(undefined);

  // EFFECTS

  // Initialization effect
  useEffect(() => {
    intializeEthers();
    getSubData();
  }, [selectedAddress]);

  // REFS

  const pollDataIntervalRef = useRef(undefined);
  const providerRef = useRef(undefined);
  const subRef = useRef(undefined);

  async function connectWallet() {
    const [selectedAddress] = await window.ethereum.enable();

    if (!checkNetwork()) {
      return;
    }

    setSelectedAddress(selectedAddress);

    // We reinitialize it whenever the user changes their account.
    window.ethereum.on("accountsChanged", ([newAddress]) => {
      if (newAddress === undefined) {
        return resetState();
      }
      setSelectedAddress(newAddress);
    });

    // We reset the dapp state if the network is changed
    window.ethereum.on("networkChanged", ([networkId]) => {
      resetState();
    });
  }

  async function intializeEthers() {
    // We first initialize ethers by creating a provider using window.ethereum
    if (selectedAddress) {
      providerRef.current = new ethers.providers.Web3Provider(window.ethereum);
    } else {
      providerRef.current = new ethers.providers.JsonRpcProvider({url: "http://localhost:8545", allowInsecure: true})
    }

    // When, we initialize the contract using that provider and the token's
    // artifact. You can do this same thing with your contracts.
    subRef.current = new ethers.Contract(
      contractAddress.Sub,
      SubArtifact.abi,
      providerRef.current.getSigner(0)
    );
  }

  async function getSubData() {
    const name = await subRef.current.name();
    const postCount = (await subRef.current.getPostCount()).toNumber();
    setSubData({name, postCount});

    for(let i = 0; i < postCount; i ++) {
      const post = await subRef.current.getPost(0);
      setSubData(subData => {
        return { ...subData, posts: [...subData.posts, post]};
      });
    }
  }

  async function makePost(ipfsHash) {

    try {
      dismissTransactionError();

      const tx = await subRef.current.makePost(ipfsHash);
      setTxBeingSent(tx.hash);

      const receipt = await tx.wait();

      if (receipt.status === 0) {
        throw new Error("Transaction failed");
      }

      // Maybe update some stuff here

    } catch (error) {

      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }
      console.error(error);
      setTransactionError(error);

    } finally {

      setTxBeingSent(undefined);
    }
  }

  function dismissTransactionError() {
    setTransactionError(undefined);
  }

  function dismissNetworkError() {
    setNetworkError(undefined);
  }

  function getRpcErrorMessage(error) {
    if (error.data) {
      return error.data.message;
    }
    return error.message;
  }

  function resetState() {
    setSubData(undefined);
    setSelectedAddress(undefined);
    setTxBeingSent(undefined);
    setTransactionError(undefined);
    setNetworkError(undefined);
  }

  // This method checks if Metamask selected network is Localhost:8545
  function checkNetwork() {
    if (window.ethereum.networkVersion === BUIDLER_EVM_NETWORK_ID) {
      return true;
    }

    setNetworkError('Please connect Metamask to Localhost:8545');

    return false;
  }

  const contextValue = {
    subData,
    selectedAddress,
    txBeingSent,
    transactionError,
    networkError,

    connectWallet,
    dismissNetworkError,
    dismissTransactionError,
    getRpcErrorMessage,
  }

  return (<DurpleContext.Provider value={contextValue}>{children}</DurpleContext.Provider>)
}
