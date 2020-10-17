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

  function upDurp() {
    if (!isUpDurped) {
      durple.upDurp(contentId);
    } else {
      durple.undoDurp(contentId);
    }
  }

  function downDurp() {
    if (!isDownDurped) {
      durple.downDurp(contentId);
    } else {
      durple.undoDurp(contentId);
    }
  }

  return (<div>
    <button className="btn btn-sm" onClick={upDurp}>
      <FaArrowAltCircleUp color={isUpDurped?"purple":"grey"}/>
    </button>
    <small><b>{content?<>{content.ud - content.dd}</>:<Skeleton width={20}/>}</b></small>
    <button className="btn btn-sm" onClick={downDurp}>
      <FaArrowAltCircleDown color={isDownDurped?"orange":"grey"}/>
    </button>
  </div>);
}
