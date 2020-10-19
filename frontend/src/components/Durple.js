import React from "react";
import '../styles/style.css';
import { About } from "./About";
import { SubDurple } from "./SubDurple";
import { MakePost } from "./MakePost";
import { Post } from "./Post";
import { ConnectWalletBtn } from "./ConnectWalletBtn";
import logo from '../assets/logo.ico'
import {useSubAddress, useSubData, useDurpleContext} from '../hooks/Durple';
import Skeleton from 'react-loading-skeleton';
//react router
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";

function Navbar() {
  const {subAddress} = useParams();
  const durple = useDurpleContext();
  useSubAddress();
  const subData = useSubData();
  let subText = undefined;
  if (subData) subText = "d/"+subData.name;
  return (
    <nav className="navbar navbar-expand-md navbar-light navbar-custom nav-bot-pad">
    <img src={logo} style={{width:"30px", margin:"10px"}} className="img-custom" alt="logo"></img>
    <a className="navbar-brand" href="/">Durple</a>
    <button type="button" className="navbar-toggler" data-toggle="collapse" data-target="#navbarContent">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarContent">
      <div className="navbar-nav mr-auto">
        {subData&&<>
          <Link className="nav-item nav-link nav-brand" to={"/d/"+subAddress}>{subText}</Link>
          {durple.selectedAddress&&<Link className=" nav-item nav-link" to={"/d/"+subAddress+"/post"}>New Post</Link>}
        </>}
      </div>
      <div className="navbar-nav">
        <ConnectWalletBtn />
      </div>
    </div>
    </nav>
  )
}

export function Durple() {
  return (
    <>
    <div >
    <Router>
      <div>
        <Switch>
          <Route path="/d/:subAddress/Post">
            <Navbar />
            <MakePost />
          </Route>
          <Route path="/d/:subAddress/:contentId">
            <Navbar />
            <Post />
          </Route>
          <Route path="/d/:subAddress">
            <Navbar />
            <SubDurple />
          </Route>
          <Route path="/">
            <Navbar />
            <About />
          </Route>
        </Switch>
      </div>
    </Router>
    </div>

    </>
  );
}
