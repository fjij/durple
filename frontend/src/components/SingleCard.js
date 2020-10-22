import React, {useState} from "react";
import '../styles/style.css';
import {usePost} from '../hooks/Durple';
import Skeleton from 'react-loading-skeleton';
import { DurationToString } from '../utils/time'
import { CommentWidget } from './CommentWidget';
import { Voter } from './Voter';
import {Redirect, useParams} from "react-router-dom";
import error from '../assets/durpleError.png'

export function SingleCard({contentId}) {
  const post = usePost(contentId);
  const [redirect, setRedirect] = useState(false)
  const { subAddress } = useParams();

  let title = null;
  let text = null;
  let op = null;

  if (post) {
    title = post.data.title;
    text = post.data.text;
    op = post.op;
  }

  if (redirect) {
    return <Redirect to={"/d/" + subAddress + "/" + contentId.toString()}/>
  }

  return(
    <div className="card card-width singleCard" onClick={(e)=>{
      setRedirect(true)
    }}>
      {
        post&&post.data.isImage&&post.data.url!==""?
        <img className="card-img-top"
        src={post.data.url} onError={(e)=>{e.target.onerror = null; e.target.src='https://i.imgur.com/ysjsmQY.png'}}/>

        :<></>
      }

      <div className="card-body">
        <h5 className="card-title wordLength"><b>{post?title:<Skeleton />}</b></h5>
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
        <small>
          <code className="walletColor">{post?op:<Skeleton />}</code>
        </small>
      <br />
      <small className="text-muted">
        {
          post?
            DurationToString(Date.now() - post.timeCreated)
            :<Skeleton width={50}/>
        }
      </small>
      </div>
    </div>
  );
}
