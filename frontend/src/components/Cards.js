import React from "react";
import '../styles/style.css';
import { SingleCard } from "./SingleCard";
import { Loading } from './Loading';

function Row({posts}) {
  return (
    <div className="card-columns">
      {posts.map(contentId => <SingleCard contentId={contentId} key={contentId} />)}
    </div>
  );
}

export function Cards({posts}) {
  const rowLength = 3;
  const rows = [];
  let currentRow = [];

  if (!posts)
    return <p className="text-center mt-5">No Posts Yet</p>;
  for (let i = 0; i < posts.length; i ++) {
    currentRow.push(posts[i]);
    if (currentRow.length >= rowLength) {
      rows.push(currentRow);
      currentRow = [];
    }
  }
  if (currentRow.length > 0) {
    rows.push(currentRow);
  }

  return(
    <div className="container-fluid col-xl-8">
        {rows.map((row, i) => <Row posts={row} key={i}/>)}
    </div>
  )
}
