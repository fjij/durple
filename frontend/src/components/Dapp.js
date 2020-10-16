import React from "react";

// We'll use ethers to interact with the Ethereum network and our contract
// All the logic of this dapp is contained in the Dapp component.
// These other components are just presentational ones: they don't have any
// logic. They just render HTML.
import { NoWalletDetected } from "./NoWalletDetected";
import { ConnectWallet } from "./ConnectWallet";
import { Loading } from "./Loading";
import { Transfer } from "./Transfer";
import { TransactionErrorMessage } from "./TransactionErrorMessage";
import { WaitingForTransactionMessage } from "./WaitingForTransactionMessage";
import { NoTokensMessage } from "./NoTokensMessage";
import { Durple } from "./Durple";
import { Cards } from "./Cards";
import { DurpleProvider, useDurpleContext } from "../hooks/Durple";

export function Dapp () {
  return (<DurpleProvider>
    <Internals />
  </DurpleProvider>);
}

function Internals () {

  const durple = useDurpleContext();

  // Ethereum wallets inject the window.ethereum object. If it hasn't been
  // injected, we instruct the user to install MetaMask.
  if (window.ethereum === undefined) {
    return <NoWalletDetected />;
  }

  // The next thing we need to do, is to ask the user to connect their wallet.
  // When the wallet gets connected, we are going to save the users's address
  // in the component's state. So, if it hasn't been saved yet, we have
  // to show the ConnectWallet component.
  //
  // Note that we pass it a callback that is going to be called when the user
  // clicks a button. This callback just calls the _connectWallet method.
  if (!durple.selectedAddress) {
    return (
      <ConnectWallet
        connectWallet={() => durple.connectWallet()}
        networkError={durple.networkError}
        dismiss={() => durple.dismissNetworkError()}
      />
    );
  }

  // If the token data or the user's balance hasn't loaded yet, we show
  // a loading component.
  if (!durple.subData) {
    return <Loading />;
  }

  // If everything is loaded, we render the application.
  return (
    <div className="container p-4">
      <div className="row">
        <div className="col-12">
          <h1>
            d/{durple.subData.name}
          </h1>
          <p>
            Welcome, <b>{durple.selectedAddress}</b>!
          </p>
        </div>
      </div>

      <hr />

      <div className="row">
        <div className="col-12">
          {durple.txBeingSent && (
            <WaitingForTransactionMessage txHash={durple.txBeingSent} />
          )}

          {durple.transactionError && (
            <TransactionErrorMessage
              message={durple.getRpcErrorMessage(durple.transactionError)}
              dismiss={() => durple.dismissTransactionError()}
            />
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          There are {durple.subData.postCount} posts on this sub!
        </div>
      </div>
    </div>
  );
}
