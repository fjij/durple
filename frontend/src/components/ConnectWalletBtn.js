import React from "react";
import '../styles/style.css';
import { useDurpleContext } from '../hooks/Durple';

export function ConnectWalletBtn() {
  const durple = useDurpleContext();
  if (durple.selectedAddress) {
    return(
       <>
       <div className="nav-item nav-link disabled">
      Connected
      </div>
      </>
    )
  }
  return(
      <button className="btn btn-warning btn-sm" onClick={durple.connectWallet}>Connect Wallet</button>
  )
}
