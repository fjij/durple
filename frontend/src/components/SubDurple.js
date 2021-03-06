import React, {useState} from "react";
import '../styles/style.css';
import { Cards } from "./Cards";
import { useSubData, useSubAddress, useDurpleContext } from "../hooks/Durple";
import { Loading } from "./Loading";
import logo from "../assets/durple grey.png";

export function SubDurple() {
  const subData = useSubData();
  const durple = useDurpleContext();

  useSubAddress();


  if (!subData && !durple.subError)
    return <Loading />

  function posts() {
    const sortedPosts = subData.posts?[...subData.posts]:undefined;
    if (sortedPosts)
      sortedPosts.sort((a, b) => b.hotness - a.hotness)
    return sortedPosts?sortedPosts.map(p => p.contentId):[];
  }

  function Logo() {
    return (
      <div className="container text-center mt-5">
        <img className="img-fluid" src={logo} alt="Empty SubDurple"/>
      </div>
    );
  }

  function WelcomeString() {
    if (durple.subError)  
      return "ERROR: Invalid Subdurple.";
    return `Welcome to d/${subData.name}`;
  }


  return (
    <>
    <div className="container text-center">
      <h1 className="subTitle mt-4 mb-4"><b>{WelcomeString()}</b></h1>
    </div>
    {subData&&subData.postCount > 0?
        <Cards posts={posts()}/>
      :<Logo />
    }
    </>
  )
}
