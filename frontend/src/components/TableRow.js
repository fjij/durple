
import React, {useState} from "react";
import '../styles/style.css';
import {usePost} from '../hooks/Durple';
import Skeleton from 'react-loading-skeleton';
import { DurationToString } from '../utils/time'
import { CommentWidget } from './CommentWidget';
import { Voter } from './Voter';
import {Redirect, useParams} from "react-router-dom";

export function TableRow({contentId}) {
  const post = usePost(contentId);
  const [redirect, setRedirect] = useState(false)
  const { subAddress } = useParams();

  let title = <Skeleton width={300}/>
  let op = <Skeleton width={100}/>

  if (post) {
    title = post.data.title;
    op = post.op;
  }

  if (redirect) {
    return <Redirect to={"/d/" + subAddress + "/" + contentId.toString()}/>
  }

  function gotoPost() {
      setRedirect(true);
  }

  return (
    <div className="d-flex justify-content-between p-3 mb-2 border rounded table-row" onClick={gotoPost}>
      <div>
        <div className="d-inline-flex mt-3 mr-2">
          {
            post&&post.data.isImage&&post.data.url!==""?

              <img className="table-img mr-4"
              src={post.data.url} onError={(e)=>{e.target.onerror = null; e.target.src='https://i.imgur.com/ysjsmQY.png'}}/>

              :<></>
          }
          <div>
            <h3 className='wordLengthWidth'>{title}</h3>
            <code className="walletColor">{op}</code>
            <br />
            <small className="text-muted">
              {post?DurationToString(Date.now() - post.timeCreated):<Skeleton width={50}/>}
            </small>
          </div>
        </div>
      </div>
      <div className="d-inline-flex mt-3 mr-2">
        <Voter contentId={contentId}/>
        <CommentWidget contentId={contentId}/>
      </div>
    </div>
  );
}
