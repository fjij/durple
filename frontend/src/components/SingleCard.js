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
    console.log(post.data.url)
  }

  return(
  <div className="card card-width">
    {post&&post.data.isImage&&post.data.url!=""?<img className="card-img-top" src={post?post.data.url:"https://images.unsplash.com/photo-1489278353717-f64c6ee8a4d2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"} alt="Card image cap"></img>:<></>}
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
