import React from "react";
import '../styles/style.css';
import { useComment } from '../hooks/Durple';
import Skeleton from 'react-loading-skeleton';

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
        <p>{comment?comment.data.text:<Skeleton count={5}/>}</p>
        <code>{comment?comment.op:<Skeleton width={"20em"}/>}</code>
      </div>
    </div>
  )
}
