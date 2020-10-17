import React from "react";
import '../styles/style.css';
import { useContent } from '../hooks/Durple';
import { useParams } from 'react-router-dom';
import { Comment } from './Comment';
import { MakeComment } from './MakeComment';
import { Voter } from './Voter';
import Skeleton from 'react-loading-skeleton';

export function Post() {
  const { contentId } = useParams();
  const content = useContent(contentId);

  return(
    <div className="container mt-4">
      <div className="card">
        <div className="card-body">
          <h1 className="card-title"><b>{content?(content.data.title?content.data.title:"Comment"):<Skeleton />}</b></h1>
          <code>{content?content.op:<Skeleton width={"20em"}/>}</code>
          <p className="mt-4">{content?content.data.text:<Skeleton count={5}/>}</p>
          <Voter contentId={contentId}/>
        </div>
      </div>
      <MakeComment contentId={contentId} disabled={!content}/>
      {content?content.comments.map(contentId => <Comment contentId={contentId}/>):<></>}
    </div>
  )
}
