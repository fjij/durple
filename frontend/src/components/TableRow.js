
import React, {useState} from "react";
import '../styles/style.css';
import {useDurpleContext, usePost} from '../hooks/Durple';
import {Link} from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { DurationToString } from '../utils/time'
import { CommentWidget } from './CommentWidget';
import { Voter } from './Voter';
import {Redirect, useParams} from "react-router-dom";

export function TableRow({contentId}) {
  const durple = useDurpleContext();
  const post = usePost(contentId);
  const [redirect, setRedirect] = useState(false)
  const { subAddress } = useParams();

  let title = <Skeleton width={300}/>
  let text = <Skeleton count={3} />
  let op = <Skeleton width={100}/>

  if (post) {
    title = post.data.title;
    text = post.data.text;
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
          {post&&post.data.isImage&&post.data.url!=""?<img className="table-img mr-4" src={post?post.data.url:"https://images.unsplash.com/photo-1489278353717-f64c6ee8a4d2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"} alt="Card image cap"></img>:<></>}
          <div>
            <h3>{title}</h3>
            <code className="walletColor">{op}</code>
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
