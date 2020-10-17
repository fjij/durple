import React from "react";
import '../styles/style.css';
import logo from '../assets/logo.png'
export function About() {
  return (
  <>
  <div className="container-fluid">
  <div className="aboutCenter">
    <img src={logo}></img>
    <h1>The Future of Forums</h1>
    <h5>Durple is the future of the internet. Updurp or Downdurp. </h5>
    <h5>Uplurkle or Lurkle. Join now and be a Durple.</h5>
    <div className="mt-4">
    <button class="btn btn-outline-primary mr-2">funny</button>
    <button class="btn btn-outline-primary ">funny</button>
    <button class="btn btn-outline-primary ml-2">funny</button>
    </div>
  </div>
  </div>
  </>
);
}
