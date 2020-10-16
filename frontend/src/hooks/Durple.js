// Durple Hooks
import React, { useState, useRef, useEffect, createContext, useContext } from "react";
import { ethers } from "ethers";

import SubArtifact from "../contracts/Sub.json";
import contractAddress from "../contracts/contract-address.json";

import { useInterval } from './useInterval';

const ipfsAPI = require('ipfs-http-client');
const ipfs = ipfsAPI({host: 'ipfs.infura.io', port: '5001', protocol: 'https' });

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

  makePost: async () => {},
  getContent: () => {},
});

export function useDurpleContext() {
  return useContext(DurpleContext);
}

export function useSubData() {
  const durple = useDurpleContext();
  return durple.subData;
}

export function usePost(contentId) {
  return useContent(contentId)
}

export function useComment(contentId) {
  return useContent(contentId)
}

function useContent(contentId) {
  const durple = useDurpleContext();
  const [content, setContent] = useState(undefined);

  useInterval(async () => {
    setContent(await durple.getContent(contentId));
    console.log('poll')
  }, 1000);

  return content;
}

export function DurpleProvider({children}) {
  // STATE
  const [subData, setSubData] = useState(undefined);
  const [content, setContent] = useState({});
  const [selectedAddress, setSelectedAddress] = useState(undefined);
  // The ID about transactions being sent, and any possible error with them
  const [txBeingSent, setTxBeingSent] = useState(undefined);
  const [transactionError, setTransactionError] = useState(undefined);
  const [networkError, setNetworkError] = useState(undefined);

  // EFFECTS

  // Initialization effect
  useEffect(() => {
    intializeEthers();
  }, [selectedAddress]);

  useInterval(() => getSubData(), 1000);


  // REFS

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

  async function getContent(contentId){
    if (content[contentId]) {
      async function fetchComments() {
        const commentCount = (await subRef.current.getCommentCount(contentId)).toNumber();
        const prevCommentCount = content[contentId].comments.length;
        const newComments = [...content[contentId].comments];
        if (prevCommentCount < commentCount) {
          for(let i = prevCommentCount; i < commentCount; i ++) {
            const commentContentId = await subRef.current.getCommentIndex(contentId, i);
            newComments.push(commentContentId);
          }
        }
        setContent(c1 => {
          const c2 = {...c1};
          c2[contentId] = {...c2[contentId], comments: newComments};
          return c2;
        });
      }

      fetchComments();
      return content[contentId];
    }

    const [ipfsPath, op, ud, dd, timeCreated] = await subRef.current.getContent(contentId);

    let str = ""
    for await (const chunk of ipfs.cat(ipfsPath)) {
      for (const char of chunk) {
        str += String.fromCharCode(char);
      }
    }

    const element = {
      ipfsPath,
      op,
      ud: ud.toNumber(),
      dd: dd.toNumber(),
      data: JSON.parse(str),
      contentId,
      comments: [],
      timeCreated: timeCreated.toNumber()*1000,
    };

    setContent(c1 => {
      const c2 = {...c1};
      c2[contentId] = element;
      return c2;
    });

    return element;
  }

  async function getSubData() {

    const postCount = (await subRef.current.getPostCount()).toNumber();
    let prevPostCount = subData? subData.postCount: 0;
    if (!subData) {
      const name = await subRef.current.name();
      setSubData({name, postCount});
    }

    if (prevPostCount === postCount) return;


    setSubData(subData => {return {...subData, postCount};})

    for(let i = prevPostCount; i < postCount; i ++) {
      const contentId = await subRef.current.getPostIndex(i);
      setSubData(subData => {
        const prevPosts = subData.posts? subData.posts: [];
        return { ...subData, posts: [...prevPosts, contentId]};
      });
    }
  }

  async function attemptTransaction(fn) {
    try {

      dismissTransactionError();
      if (!selectedAddress) {
        throw new Error("No wallet connected");
      }

      const tx = await fn();
      setTxBeingSent(tx.hash);

      const receipt = await tx.wait();

      if (receipt.status === 0) {
        throw new Error("Transaction failed");
      }
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

  async function makePost(title, isImage, url, text) {
    const content = {title, isImage, url, text};
    attemptTransaction(async() => {
      const {cid} = await ipfs.add(JSON.stringify(content));
      const tx = await subRef.current.makePost(cid.toString());
      return tx;
    });
  }

  async function makeComment(contentId, text) {
    const content = {text};
    attemptTransaction(async() => {
      const {cid} = await ipfs.add(JSON.stringify(content));
      const tx = await subRef.current.makeComment(cid.toString(), contentId);
      return tx;
    });
  }

  async function upDurp(contentIndex) {
    attemptTransaction(async() => {
      const tx = await subRef.current.upDurp(contentIndex);
      return tx;
    });
  }

  async function downDurp(contentIndex) {
    attemptTransaction(async() => {
      const tx = await subRef.current.downDurp(contentIndex);
      return tx;
    });
  }

  async function undoDurp(contentIndex) {
    attemptTransaction(async() => {
      const tx = await subRef.current.undoDurp(contentIndex);
      return tx;
    });
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

    makePost,
    makeComment,
    getContent,
    upDurp,
    downDurp,
    undoDurp,
  }

  return (<DurpleContext.Provider value={contextValue}>{children}</DurpleContext.Provider>)
}
