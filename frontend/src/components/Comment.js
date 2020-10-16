import React from "react";
import '../styles/style.css';
import { useComment } from '../hooks/Durple';
import Skeleton from 'react-loading-skeleton';

export function Comment({contentId}) {
  const comment = useComment(contentId);

  return(
    <div className="card">
      <div className="card-body">
        <p>{comment?comment.data.text:<Skeleton count={5}/>}</p>
        <code>{comment?comment.op:<Skeleton width={"20em"}/>}</code>
      </div>
    </div>
  )
}
