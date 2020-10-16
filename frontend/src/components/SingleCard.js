import React from "react";
import '../styles/style.css';
import {useDurpleContext, usePost} from '../hooks/Durple';

export function SingleCard({contentId}) {
  const durple = useDurpleContext();
  const post = usePost(contentId);

  let title = "Post title";
  let text = "Post body";
  let points = 0;

  if (post) {
    title = post.data.title;
    text = post.data.text;
    points = post.ud - post.dd;
  }

  return(
  <div className="card card-width">
    <img className="card-img-top" src="https://www.w3schools.com/bootstrap/newyork.jpg" alt="Card image cap"></img>
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text wordLength">{text}</p>
        <a href="#" className="btn btn-primary btn-sm mr-2">UpDurp</a>
        <a href="#" className="btn btn-danger btn-sm mr-2">DownDurp</a>
        <a href="#" className="disabled btn btn-secondary btn-sm">{points} points</a>
      </div>
  </div>
  )
}
