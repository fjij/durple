import React, {useState} from "react";
import '../styles/style.css';
import {useDurpleContext, usePost} from '../hooks/Durple';
import {Link} from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { DurationToString } from '../utils/time'
import { CommentWidget } from './CommentWidget';
import { Voter } from './Voter';
import {Redirect, useParams} from "react-router-dom";

export function SingleCard({contentId}) {
  const durple = useDurpleContext();
  const post = usePost(contentId);
  const[redirect, setRedirect] = useState(false)
  const { subAddress } = useParams();

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

  if (redirect) {
    return <Redirect to={"/d/" + subAddress + "/" + contentId.toString()}/>
  }

  return(
  <div className="card card-width singleCard" onClick={(e)=>{
    setRedirect(true)
  }}>
    {post&&post.data.isImage&&post.data.url!=""?<img className="card-img-top" src={post?post.data.url:"https://images.unsplash.com/photo-1489278353717-f64c6ee8a4d2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"} alt="Card image cap"></img>:<></>}
      <div className="card-body">
        <h5 className="card-title"><b>{post?title:<Skeleton />}</b></h5>
        <div className="card-text">
          <p className="wordLength">
          {post?text:<Skeleton />}
          </p>
          <div className="d-flex flex-row p-0">
              <Voter contentId={contentId}/>
              <CommentWidget contentId={contentId}/>
          </div>
        </div>
      </div>

      <div className="card-footer">
          <small><code className="walletColor">{post?op:<Skeleton />}</code></small>
          <br />
        <small className="text-muted">
        {post?DurationToString(Date.now() - post.timeCreated):<Skeleton width={50}/>}
        </small>
      </div>
  </div>
  )
}
