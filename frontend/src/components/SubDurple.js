import React, {useState} from "react";
import '../styles/style.css';
import { Cards } from "./Cards";
import { Table } from "./Table";
import { useSubData, useDurpleContext, useSubAddress } from "../hooks/Durple";
import { Loading } from "./Loading";
import logo from "../assets/durple grey.png";

export function SubDurple() {
  const subData = useSubData();
  const durple = useDurpleContext();
  const [view, setView] = useState("cards");

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
      <div class="btn-group mb-4" role="group" aria-label="Basic example">
        <button type="button" class={"btn btn-sm "+(view==="cards"?"btn-secondary":"btn-outline-secondary")} onClick={() => setView("cards")}>Cards</button>
        <button type="button" class={"btn btn-sm "+(view==="table"?"btn-secondary":"btn-outline-secondary")} onClick={() => setView("table")}>Table</button>
      </div>
    </div>
    {subData&&subData.postCount > 0?
      <>{
        view === "cards"?
        <Cards posts={sortedPosts?sortedPosts.map(p => p.contentId):[]}/>
        :<Table posts={sortedPosts?sortedPosts.map(p => p.contentId):[]}/>
      }</>
      :<Logo />
    }
    </>
  )
}
