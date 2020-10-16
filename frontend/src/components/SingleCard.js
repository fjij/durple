import React from "react";
import '../styles/style.css';
import {useDurpleContext, usePost} from '../hooks/Durple';
import Skeleton from 'react-loading-skeleton';

export function SingleCard({contentId}) {
  const durple = useDurpleContext();
  const post = usePost(contentId);

  let title = null;
  let text = null;
  let points = null;
  let op = null;
  let commentCount = null;

  if (post) {
    title = post.data.title;
    text = post.data.text;
    points = post.ud - post.dd;
    op = post.op;
    commentCount = post.comments.length;
  }

  return(
  <div className="card card-width">
    <img className="card-img-top" src="https://www.w3schools.com/bootstrap/newyork.jpg" alt="Card image cap"></img>
      <div className="card-body">
        <h5 className="card-title"><b>{title?title:<Skeleton />}</b></h5>
        <p className="card-text">
          <p className="author">{op?op:<Skeleton />}</p>
          <p className="wordLength">
          {text?text:<Skeleton />}
          </p>
        <a href="#" className="btn btn-primary btn-sm mr-2">UpDurp</a>
        <a href="#" className="btn btn-danger btn-sm mr-2">DownDurp</a>
        <b>{points!==null?<>{points} points</>:<Skeleton width={100}/>}</b>
        </p>
      </div>
  </div>
  )
}
