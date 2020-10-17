import React, { useState } from "react";
import '../styles/style.css';
import { useDurpleContext } from '../hooks/Durple';
import { useParams } from 'react-router-dom';
import { Comment } from './Comment';
import Skeleton from 'react-loading-skeleton';

export function MakeComment({contentId, disabled}) {
  const durple = useDurpleContext();
  const [text, setText] = useState("");


  return(
      <div className="card mt-4">
        <div className="card-body">
          <h5>Comment</h5>
          <form className="mt-4" onSubmit={e => {
            e.preventDefault();
            if (text != "") {
              durple.makeComment(contentId, text);
              setText("")
            }
          }}>
            <div className="form-group">
              <textarea className="form-control" value={text} onChange={e => setText(e.target.value)} />
            </div>

            <input className="btn btn-primary" type="submit" value="Submit" disabled={disabled}></input>
          </form>
        </div>
      </div>
  )
}
