import React from "react";

import { Durple } from "./Durple";
import { DurpleProvider } from "../hooks/Durple";

export function Dapp () {
  return (<DurpleProvider>
    <Durple />
  </DurpleProvider>);
}
