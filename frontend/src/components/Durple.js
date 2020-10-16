import React, { useState, useRef, useEffect } from "react";
import '../styles/style.css';
import { Cards } from "./Cards";
import { About } from "./About";
import { SubDurpleHome } from "./SubDurpleHome";
import { MakePost } from "./MakePost";
import { Post } from "./Post";
import { ConnectWalletBtn } from "./ConnectWalletBtn";
import logo from '../assets/logo.ico'
//react router
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

export function Durple() {
  return (
    <>
    <div >
    <Router>
      <div>
        <nav className="navbar navbar-expand-md navbar-light navbar-custom nav-bot-pad">
        <img src={logo} style={{width:"30px", margin:"10px"}} className="img-custom" alt="logo"></img>
        <a className="navbar-brand" href="#">Durple</a>
        <button type="button" className="navbar-toggler" data-toggle="collapse" data-target="#navbarContent">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarContent">
            <div className="navbar-nav">
              <Link to="/SubDurpleHome" className="nav-item nav-link">SubDurpleHome</Link>
              <Link to="/About" className="nav-item nav-link">About</Link>
              <Link to="/MakePost" className="nav-item nav-link">Post</Link>
              <ConnectWalletBtn />
            </div>
        </div>
        </nav>
        <Switch>
          <Route path="/About">
            <About />
          </Route>
          <Route path="/SubDurpleHome">
            <SubDurpleHome />
          </Route>
          <Route path="/MakePost">
            <MakePost />
          </Route>
          <Route path="/Post/:contentId">
            <Post />
          </Route>
        </Switch>
      </div>
    </Router>
    </div>

    </>
  );
}
