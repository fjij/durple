import React, { useState, useRef, useEffect } from "react";
import '../styles/style.css';
import { Cards } from "./Cards";
import { About } from "./About";
import { SubDurpleHome } from "./SubDurpleHome";
import logo from '../assets/logo.ico'
//react router
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
/*
function PageChange(props) {
  switch (props.page) {
    case "subDurple":
      return <SubDurpleHome />
      break;
    case "about":
      return <About />
      break;
    default:
      return <SubDurpleHome />
  }
}*/
/*
export function Durple() {
  const [page, setPage] = useState("home")
  return(
  <>
  <Router>
  <nav className="navbar navbar-expand-lg navbar-dark navbar-custom">
    <a className="navbar-brand" href="#">Durple</a>
    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div className="navbar-nav">
          <a className="nav-item nav-link" onClick={()=>setPage("subDurple")}>SubDurple</a>
          <a className="nav-item nav-link" onClick={()=>setPage("about")}>About</a>
        </div>
      </div>
  </nav>
  </Router>
  <PageChange page={page}/>
  </>
  );
}*/

export function Durple() {
  return (
    <div ClassName="container">
    <Router>
      <div>
        <nav className="navbar navbar-expand-sm navbar-light navbar-custom nav-bot-pad">
        <img src={logo} style={{width:"30px", margin:"10px"}} className="img-custom" alt="logo"></img>
          <a className="navbar-brand" href="#">Durple</a>
            <div className="navbar-nav">
              <Link to="/SubDurpleHome" className="nav-item nav-link">SubDurpleHome</Link>
              <Link to="/About" className="nav-item nav-link">About</Link>
            </div>
        </nav>
        <Switch>
          <Route path="/About">
            <About />
          </Route>
          <Route path="/SubDurpleHome">
            <SubDurpleHome />
          </Route>
        </Switch>
      </div>
    </Router>
    </div>
  );
}
