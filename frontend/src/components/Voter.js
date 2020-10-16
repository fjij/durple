import React from 'react';
import { useContent, useDurpleContext } from '../hooks/Durple';
import { FaArrowAltCircleUp, FaArrowAltCircleDown} from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';

export function Voter({contentId}) {
  const durple = useDurpleContext();
  const content = useContent(contentId);
  return (<div>
    <button className="btn btn-sm" onClick={() => durple.upDurp(contentId)}><FaArrowAltCircleUp color="grey"/></button>
    <small><b>{content?<>{content.ud - content.dd}</>:<Skeleton width={20}/>}</b></small>
    <button className="btn btn-sm" onClick={() => durple.downDurp(contentId)}><FaArrowAltCircleDown color="grey"/></button>
  </div>);
}
