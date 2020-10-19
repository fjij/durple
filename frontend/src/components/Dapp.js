import React from "react";

import { Durple } from "./Durple";
import { DurpleProvider } from "../hooks/Durple";
import { positions, Provider } from "react-alert";
import { Alert } from "./Alert";

const options = {
  timeout: 0,
  position: positions.BOTTOM_CENTER
}

export function Dapp () {
  return ( <Provider template={Alert} {...options}>
    <DurpleProvider>
      <Durple />
    </DurpleProvider>
  </Provider>);
}
