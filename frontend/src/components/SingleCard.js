import React from "react";
import '../styles/style.css';
import {useDurpleContext, usePost} from '../hooks/Durple';
import {Link} from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { FaCommentAlt } from 'react-icons/fa';
import { DurationToString } from '../utils/time'
import { Voter } from './Voter';

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
    {post&&post.data.isImage&&post.data.url!=""?<img className="card-img-top" src={post?post.data.url:"https://images.unsplash.com/photo-1489278353717-f64c6ee8a4d2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"} alt="Card image cap"></img>:<></>}
      <div className="card-body">
        <h5 className="card-title"><b>{post?<Link to={"/Post/" + contentId.toString()}>{title}</Link>:<Skeleton />}</b></h5>
        <div className="card-text">
          <p className="wordLength">
          {post?text:<Skeleton />}
          </p>
              <Voter contentId={contentId}/>
              <b>{post?<Link className="text-secondary" to={"/Post/" + contentId.toString()}><FaCommentAlt />{" "}{post.comments.length}</Link>:<Skeleton />}</b>
        </div>
      </div>

      <div className="card-footer">
          <small><code>{post?op:<Skeleton />}</code></small>
          <br />
        <small className="text-muted">
        {post?DurationToString(Date.now() - post.timeCreated):<Skeleton width={50}/>}
        </small>
      </div>

  </div>
  )
}
