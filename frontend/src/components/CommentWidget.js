
import React from 'react';
import { useContent } from '../hooks/Durple';
import { FaCommentAlt } from 'react-icons/fa';
import {Link, useParams} from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';

export function CommentWidget({contentId}){
  const content = useContent(contentId);
  const { subAddress } = useParams();
  return (<div><b>
    {content
      ?<Link className="text-secondary text-nowrap" to={"/d/" + subAddress + "/" + contentId.toString()}><FaCommentAlt />{" "}{content.commentCount}</Link>
      :<Skeleton width={30} />}
  </b></div>);
}
