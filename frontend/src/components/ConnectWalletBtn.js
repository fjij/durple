import React from "react";
import '../styles/style.css';
import { useDurpleContext } from '../hooks/Durple';

export function ConnectWalletBtn() {
  const durple = useDurpleContext();
  if (durple.selectedAddress) {
    return "Connected";
  }
  return(
    <>
      <button className="btn btn-primary btn-sm" onClick={durple.connectWallet}>Connect Wallet</button>
    </>
  )
}
