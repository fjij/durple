import React from "react";
import '../styles/style.css';
import { SingleCard } from "./SingleCard";

export function Cards() {
  let cards = [];
  for(let i = 0; i < 9; i++) {
    cards.push(<SingleCard />)
  }
  return(
  <div className="container">
  <div className="card-columns">

  {cards}
  </div>
  </div>
  )
}
