import React from 'react';
import { useContent, useDurpleContext } from '../hooks/Durple';
import { FaArrowAltCircleUp, FaArrowAltCircleDown} from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';

export function Voter({contentId}) {
  const durple = useDurpleContext();
  const content = useContent(contentId);
  let isUpDurped = false;
  let isDownDurped = false;

  if (content) {
    isUpDurped = content.isUpDurped;
    isDownDurped = content.isDownDurped;
  }

  function upDurp(e) {
    if (!isUpDurped) {
      durple.upDurp(contentId);
    } else {
      durple.undoDurp(contentId);
    }
    e.stopPropagation()
  }

  function downDurp(e) {
    if (!isDownDurped) {
      durple.downDurp(contentId);
    } else {
      durple.undoDurp(contentId);
    }
    e.stopPropagation()
  }

  return (<div className= "d-flex flex-row p-0 mr-3">
    <div className="mr-2" onClick={upDurp}>
      <FaArrowAltCircleUp color={isUpDurped?"purple":"grey"}/>
    </div>
    <b>{content?<>{content.ud - content.dd}</>:<Skeleton width={20}/>}</b>
    <div className="ml-2" onClick={downDurp}>
      <FaArrowAltCircleDown color={isDownDurped?"orange":"grey"}/>
    </div>
  </div>
);
}
