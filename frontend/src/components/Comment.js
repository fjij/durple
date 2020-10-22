import React from "react";
import '../styles/style.css';
import { useComment } from '../hooks/Durple';
import Skeleton from 'react-loading-skeleton';
import { Voter } from './Voter'
// import { CommentWidget } from './CommentWidget';

export function CommentPlaceholder(){
  return(
    <div className="card mt-4">
      <div className="card-body">
        <p><Skeleton count={5}/></p>
        <code><Skeleton width={"20em"}/></code>
      </div>
    </div>
  )

}

export function Comment({contentId}) {
  const comment = useComment(contentId);

  return(
    <div className="card mt-4">
      <div className="card-body">
      <code className="walletColor">{comment?comment.op:<Skeleton width={"20em"}/>}</code>
        <p>
        {
          comment?
            comment.data.text.split("\n").map((item, idx) => <span key={idx}>
              {item}
              <br/>
            </span>)
            :<Skeleton count={3}/>
        }
        </p>
        <div className="d-flex flex-row p-0 mt-2">
        <Voter contentId={contentId}/>
      {/*<CommentWidget contentId={contentId}/>*/}
        </div>
      </div>
    </div>
  )
}

