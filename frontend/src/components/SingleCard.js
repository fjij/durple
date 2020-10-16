import React from "react";
import '../styles/style.css';

export function SingleCard() {
  return(
  <div className="card card-width">
    <img className="card-img-top" src="https://www.w3schools.com/bootstrap/newyork.jpg" alt="Card image cap"></img>
      <div className="card-body">
        <h5 className="card-title">Card title</h5>
        <p className="card-text wordLength">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation</p>
        <a href="#" class="btn btn-primary btn-sm">UpDurp</a>
        <a href="#" class="btn btn-danger btn-sm">DownDurp</a>
      </div>
  </div>
  )
}
