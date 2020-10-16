import React from "react";
import '../styles/style.css';
import { usePost } from '../hooks/Durple';
import { useParams } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';

export function Post() {
  const { contentId } = useParams();
  const post = usePost(contentId);

  return(
    <div className="container mt-4">
      <h1><b>{post?post.data.title:<Skeleton />}</b></h1>
      <code>{post?post.op:<Skeleton width={"20em"}/>}</code>
      <p className="mt-4">{post?post.data.text:<Skeleton count={5}/>}</p>
    </div>
  )
}
