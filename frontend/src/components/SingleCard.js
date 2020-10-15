import React from "react";
import '../styles/style.css';

export function SingleCard() {
  return(
  <div className="card card-width">
    <img className="card-img-top img-thumbnail" src="https://www.w3schools.com/bootstrap/paris.jpg" alt="Card image cap"></img>
      <div className="card-body">
        <h5 className="card-title">Card title</h5>
        <p className="card-text wordLength">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      </div>
  </div>
  )
}
