import React from "react";
import '../styles/style.css';
import { SingleCard } from "./SingleCard";

export function Cards() {
  let cards = [];
  for(let i = 0; i < 9; i++) {
    cards.push(<SingleCard />)
  }
  return(
  <div className="container-fluid col-xl-8">
  <div className="card-deck">
  <SingleCard />
  <SingleCard />
  <SingleCard />
  </div>
  <div className="card-deck mt-4">
  <SingleCard />
  <SingleCard />
  <SingleCard />
  </div>
  <div className="card-deck mt-4">
  <SingleCard />
  <SingleCard />
  <SingleCard />
  </div>
  </div>
  )
}
