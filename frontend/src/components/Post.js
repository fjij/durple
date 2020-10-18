import React from "react";
import '../styles/style.css';
import { useContent, useSubAddress } from '../hooks/Durple';
import { useParams } from 'react-router-dom';
import { Comment } from './Comment';
import { MakeComment } from './MakeComment';
import { Voter } from './Voter';
import Skeleton from 'react-loading-skeleton';
import { CommentWidget } from './CommentWidget';

export function Post() {
  const { contentId } = useParams();
  const content = useContent(contentId, true);
  useSubAddress();

  return(
    <div className="container mt-4">
      <div className="card">
        <div className="card-body">
          <h1 className="card-title mb-0"><b>{content?(content.data.title?content.data.title:"Comment"):<Skeleton />}</b></h1>
          <code className="walletColor">{content?content.op:<Skeleton width={"20em"}/>}</code>
          {content&&content.data.isImage&&content.data.url!=""?<><br></br><img className="card-img-top col-md-6 col-xl-4 p-0 mt-3" src={content?content.data.url:"https://images.unsplash.com/photo-1489278353717-f64c6ee8a4d2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"} alt="Card image cap"></img></>:<></>}
          <p className="mt-1">{content?content.data.text:<Skeleton count={5}/>}</p>
          <div className="d-flex flex-row p-0">
              <Voter contentId={contentId}/>
              <CommentWidget contentId={contentId}/>
          </div>
        </div>
      </div>
      <MakeComment contentId={contentId} disabled={!content}/>
      {content?content.comments.map(contentId => <Comment contentId={contentId}/>):<></>}
    </div>
  )
}
