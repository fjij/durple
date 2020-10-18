import React, { useState } from "react";
import '../styles/style.css';
import { useDurpleContext } from '../hooks/Durple';

export function MakeComment({contentId, disabled}) {
  const durple = useDurpleContext();
  const [waiting, setWaiting] = useState(false);
  const [text, setText] = useState("");
  if (!durple.selectedAddress) {
    return "";
  }

  return(
      <div className="card mt-4">
        <div className="card-body">
          <h5>Comment</h5>
          <form className="mt-4" onSubmit={async (e) => {
            e.preventDefault();
            if (text !== "") {
              setWaiting(true);
              const success = await durple.makeComment(contentId, text);
              setWaiting(false);
              if (success)
                setText("")
            }
          }}>
            <fieldset disabled={waiting}>
              <div className="form-group">
                <textarea className="form-control" value={text} onChange={e => setText(e.target.value)} />
              </div>

              <input className="btn btn-primary" type="submit" value="Submit" disabled={disabled}></input>
            </fieldset>
          </form>
        </div>
      </div>
  )
}
