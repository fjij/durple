import React, {useEffect} from "react";
import '../styles/style.css';
import { useDurpleContext } from '../hooks/Durple';

export function ConnectWalletBtn() {
  const durple = useDurpleContext();
  const localStorage = window.localStorage;
  const shouldAutoConnect = localStorage.getItem("shouldAutoConnect");
  const noWalletDetected = (window.ethereum === undefined)
  useEffect(() => {
    if (shouldAutoConnect && !noWalletDetected && !durple.selectedAddress) {
      durple.connectWallet();
    }
  }, [shouldAutoConnect, durple, noWalletDetected]);

  function connect() {
    durple.connectWallet();
    localStorage.setItem('shouldAutoConnect', true);
  }

  if (window.ethereum === undefined) {
    return ( <div className="nav-item nav-link disabled"> No Wallet Detected </div> );
  } else if (durple.selectedAddress) {
    return ( <div className="nav-item nav-link disabled"> Connected </div> );
  } else if (shouldAutoConnect) {
    return ( <div className="nav-item nav-link disabled"> Connecting... </div> );
  } else {
    return ( <button className="btn btn-warning btn-sm" onClick={connect}>Connect Wallet</button> );
  }
}
