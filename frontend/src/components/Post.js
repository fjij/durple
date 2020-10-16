import React from "react";
import '../styles/style.css';
import { usePost } from '../hooks/Durple';
import { useParams } from 'react-router-dom';
import { Comment } from './Comment';
import { MakeComment } from './MakeComment';
import { Voter } from './Voter';
import Skeleton from 'react-loading-skeleton';

export function Post() {
  const { contentId } = useParams();
  const post = usePost(contentId);

  return(
    <div className="container mt-4">
      <div className="card">
        <div className="card-body">
          <h1 className="card-title"><b>{post?post.data.title:<Skeleton />}</b></h1>
          <code>{post?post.op:<Skeleton width={"20em"}/>}</code>
          <p className="mt-4">{post?post.data.text:<Skeleton count={5}/>}</p>
          <Voter contentId={contentId}/>
        </div>
      </div>
      <MakeComment contentId={contentId} disabled={!post}/>
      {post?post.comments.map(contentId => <Comment contentId={contentId}/>):<></>}
    </div>
  )
}
