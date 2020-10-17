
import React from 'react';
import { useContent } from '../hooks/Durple';
import { FaCommentAlt } from 'react-icons/fa';
import {Link} from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';

export function CommentWidget({contentId}){
  const content = useContent(contentId);
  return (<div><b>
    {content
      ?<Link className="text-secondary" to={"/Post/" + contentId.toString()}><FaCommentAlt />{" "}{content.commentCount}</Link>
      :<Skeleton width={30} />}
  </b></div>);
}
