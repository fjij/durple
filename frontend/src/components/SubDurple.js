import React from "react";
import '../styles/style.css';
import { Cards } from "./Cards";
import { useSubData, useDurpleContext } from "../hooks/Durple";
import { Loading } from "./Loading";

export function SubDurple() {
  const subData = useSubData();
  const durple = useDurpleContext();

  if (!subData)
    return <Loading />

  const sortedPosts = [...subData.posts]
  sortedPosts.sort((a, b) => b.hotness - a.hotness)

  return (
    <>
    <div className="container text-center">
      <h1 className="subTitle">d/{subData.name}</h1>
    </div>
    <Cards posts={subData.posts}/>
    </>
  )
}
