import React from "react";
import '../styles/style.css';
import { Cards } from "./Cards";

export function Durple() {
  return(
  <>
  <nav className="navbar navbar-expand-lg navbar-dark navbar-custom">
    <a className="navbar-brand" href="#">Durple</a>
    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div className="navbar-nav">
          <a className="nav-item nav-link active" href="#">Home <span class="sr-only">(current)</span></a>
          <a className="nav-item nav-link" href="#">Posts</a>
          <a className="nav-item nav-link" href="#">About</a>
        </div>
      </div>
  </nav>

  <Cards />
  </>
  );
}
