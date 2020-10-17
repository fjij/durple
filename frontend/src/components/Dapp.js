import React from "react";

import { Durple } from "./Durple";
import { DurpleProvider } from "../hooks/Durple";
import { positions, Provider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

const options = {
  timeout: 5000,
  position: positions.BOTTOM_CENTER
}

export function Dapp () {
  return ( <Provider template={AlertTemplate} {...options}>
    <DurpleProvider>
      <Durple />
    </DurpleProvider>
  </Provider>);
}
