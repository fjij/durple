// Durple Hooks
import React, { useState, useRef, useEffect, createContext, useContext } from "react";
import { ethers } from "ethers";
import { useParams } from 'react-router-dom';
import { useAlert } from 'react-alert';

import SubArtifact from "../contracts/Sub.json";
import ProfileArtifact from "../contracts/Profile.json";
import contractAddress from "../contracts/contract-address.json";
import { utf8ByteArrayToString } from 'utf8-string-bytes';

import { useInterval } from './useInterval';

import { ipfsConfig, rpcConfig, BUIDLER_EVM_NETWORK_ID} from './config';

const ipfsAPI = require('ipfs-http-client');
const ipfs = ipfsAPI(ipfsConfig);


// This is an error code that indicates that the user canceled a transaction
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

const DurpleContext = createContext({ });

export function useSubAddress() {
  const durple = useDurpleContext();

  const { subAddress } = useParams();

  useEffect(() => {
    durple.setCurrentSubAddress(subAddress);
  }, [subAddress, durple])
}

export function useDurpleContext() {
  return useContext(DurpleContext);
}

export function useSubData() {
  const durple = useDurpleContext();
  return durple.subData;
}

export function useProfileData() {
  const durple = useDurpleContext();
  return durple.profileData;
}

export function usePost(contentId) {
  return useContent(contentId)
}

export function useComment(contentId) {
  return useContent(contentId)
}

export function useContent(contentId, active=false) {
  const durple = useDurpleContext();
  const [content, setContent] = useState(undefined);

  useInterval(async () => {
    setContent(await durple.getContent(contentId, active));
  }, 1000);

  return content;
}

export function DurpleProvider({children}) {
  // STATE
  const [currentSubAddress, setCurrentSubAddress] = useState(undefined);
  const [subData, setSubData] = useState(undefined);
  const [profileData, setProfileData] = useState(undefined);
  const [content, setContent] = useState({});
  const [selectedAddress, setSelectedAddress] = useState(undefined);
  // The ID about transactions being sent, and any possible error with them
  const [txBeingSent, setTxBeingSent] = useState(undefined);
  const [transactionError, setTransactionError] = useState(undefined);
  const [networkError, setNetworkError] = useState(undefined);

  const alert = useAlert();

  // EFFECTS

  // Initialization effect
  useEffect(() => {
    initializeEthers();
  }, [selectedAddress, currentSubAddress]);

  useInterval(() => getSubData(), 1000);
  useInterval(() => getProfileData(), 1000);

  // Error listners
  useEffect(() => {
    if (transactionError) {
      const message = getRpcErrorMessage(transactionError);
      alert.error(message);
    }
  }, [transactionError, alert]);

  useEffect(() => {
    if (networkError) {
      const message = getRpcErrorMessage(networkError);
      alert.error(message);
    }
  }, [networkError, alert]);

  // REFS

  const providerRef = useRef(undefined);
  const subRef = useRef(undefined);
  const profileRef = useRef(undefined);

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

  async function initializeEthers() {
    if (selectedAddress) {
      providerRef.current = new ethers.providers.Web3Provider(window.ethereum);
    } else {
      providerRef.current = new ethers.providers.JsonRpcProvider(rpcConfig)
    }
    try {
      profileRef.current = new ethers.Contract(
        contractAddress.Profile,
        ProfileArtifact.abi,
        selectedAddress?
          providerRef.current.getSigner(0):
          providerRef.current
      );
    } catch(e) {
      setNetworkError({message:"Durple profile error."});
      console.error(e);
    }

    if (currentSubAddress) {
      // When, we initialize the contract using that provider and the token's
      // artifact. You can do this same thing with your contracts.
      try {
        subRef.current = new ethers.Contract(
          currentSubAddress,
          SubArtifact.abi,
          selectedAddress?
            providerRef.current.getSigner(0):
            providerRef.current
        );
      } catch(e) {
        setNetworkError({message:"Invalid sub address!"});
        console.error(e);
      }
      setContent({})
    } else {
      subRef.current = undefined;
    }
  }

  async function getContent(contentId, active){
    if (content[contentId]) {

      // Second time it gets called

      // Check to see if any new comments
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
        // replace old list of comments with new list of comments
        setContent(c1 => {
          const c2 = {...c1};
          c2[contentId] = {...c2[contentId], comments: newComments};
          return c2;
        });
      }

      // Check to see if any new durps
      async function fetchDurps() {
        const [, , ud, dd, ] = await subRef.current.getContent(contentId);
        const isUpDurped = await subRef.current.isUpDurped(contentId);
        const isDownDurped = await subRef.current.isDownDurped(contentId);

        // replace old values of ud and dd
        setContent(c1 => {
          const c2 = {...c1};
          c2[contentId] = {
            ...c2[contentId],
            ud: ud.toNumber(),
            dd: dd.toNumber(),
            isUpDurped,
            isDownDurped
          };
          return c2;
        });
      }

      if (active) {
        fetchComments();
        fetchDurps();
      }
      return content[contentId];
    }

    // First time it gets called

    // get content
    const [ipfsPath, op, ud, dd, timeCreated] = await subRef.current.getContent(contentId);
    const commentCount = (await subRef.current.getCommentCount(contentId)).toNumber();
    const isUpDurped = await subRef.current.isUpDurped(contentId);
    const isDownDurped = await subRef.current.isDownDurped(contentId);
    const hotness = (await subRef.current.getHotness(contentId)).toNumber();

    // resolve ipfs path
    let str = ""
    for await (const chunk of ipfs.cat(ipfsPath)) {
      str += utf8ByteArrayToString(chunk);
    }

    // create content object
    const element = {
      ipfsPath,
      op,
      ud: ud.toNumber(),
      dd: dd.toNumber(),
      data: JSON.parse(str),
      contentId,
      isUpDurped,
      isDownDurped,
      commentCount,
      comments: [],
      timeCreated: timeCreated.toNumber()*1000,
      hotness
    };

    // add this to the map
    setContent(c1 => {
      const c2 = {...c1};
      c2[contentId] = element;
      return c2;
    });

    // give this back to the caller
    return element;
  }

  async function getSubData() {

    if (!subRef.current) return;

    const postCount = (await subRef.current.getPostCount()).toNumber();
    let prevPostCount = subData? subData.postCount: 0;
    if (!subData) {
      const name = await subRef.current.name();
      setSubData({name, postCount});
    }

    if (prevPostCount === postCount) return;


    setSubData(subData => {return {...subData, postCount};})

    const newPosts = [];

    for(let i = prevPostCount; i < postCount; i ++) {
      const contentId = await subRef.current.getPostIndex(i);
      const hotness = (await subRef.current.getHotness(contentId)).toNumber();
      newPosts.push({contentId, hotness})
    }

    setSubData(subData => {
      const prevPosts = subData.posts? subData.posts: [];
      return { ...subData, posts: [...prevPosts, ...newPosts]};
    });
  }

  async function getProfileData() {

    if (!profileRef.current) return;
    if (profileData) return;

    const featuredCount = (await profileRef.current.getFeaturedSubCount()).toNumber();
    const featured = [];

    for(let i = 0; i < featuredCount; i ++) {
      const [address, name] = await profileRef.current.getFeaturedSub(i);
      featured.push({address, name});
    }

    setProfileData(profileData => {
      return { ...profileData, featured};
    });
  }

  async function attemptTransaction(fn) {
    let success = true;
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
      success = false;

    } finally {
      setTxBeingSent(undefined);
    }
    return success;
  }

  async function makePost(title, isImage, url, text) {
    const content = {title, isImage, url, text};
    return await attemptTransaction(async() => {
      const {cid} = await ipfs.add(JSON.stringify(content));
      const tx = await subRef.current.makePost(cid.toString());
      return tx;
    });
  }

  async function makeComment(contentId, text) {
    const content = {text};
    return await attemptTransaction(async() => {
      const {cid} = await ipfs.add(JSON.stringify(content));
      const tx = await subRef.current.makeComment(cid.toString(), contentId);
      return tx;
    });
  }

  async function upDurp(contentIndex) {
    return await attemptTransaction(async() => {
      const tx = await subRef.current.upDurp(contentIndex);
      return tx;
    });
  }

  async function downDurp(contentIndex) {
    return await attemptTransaction(async() => {
      const tx = await subRef.current.downDurp(contentIndex);
      return tx;
    });
  }

  async function undoDurp(contentIndex) {
    return await attemptTransaction(async() => {
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
    setCurrentSubAddress(undefined);
    setSubData(undefined);
    setProfileData(undefined);
    setContent({});
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
    profileData,
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

    currentSubAddress,
    setCurrentSubAddress,
  }

  return (<DurpleContext.Provider value={contextValue}>{children}</DurpleContext.Provider>)
}
