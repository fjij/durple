import React from "react";
import '../styles/style.css';
import { Cards } from "./Cards";
import { useSubData, useDurpleContext, useSubAddress } from "../hooks/Durple";
import { Loading } from "./Loading";
import logo from "../assets/durple grey.png";

export function SubDurple() {
  const subData = useSubData();
  const durple = useDurpleContext();

  useSubAddress();


  if (!subData)
    return <Loading />

  const sortedPosts = subData.posts?[...subData.posts]:undefined;
  if (sortedPosts)
    sortedPosts.sort((a, b) => b.hotness - a.hotness)

  function Logo() {
    return (
      <div className="container text-center mt-5">
        <img className="img-fluid" src={logo} />
      </div>
    );
  }


  return (
    <>
    <div className="container text-center">
      <h1 className="subTitle mt-4 mb-4"><b>Welcome to d/{subData.name}</b></h1>
    </div>
    {subData&&subData.postCount > 0?
      <Cards posts={sortedPosts?sortedPosts.map(p => p.contentId):[]}/>
      :<Logo />
    }
    </>
  )
}
