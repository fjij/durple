import React from "react";
import '../styles/style.css';

export function Post() {
  return(
    <>
    <form className="mt-4">
    <div className="form-group">
      <label for="subDurple">SubDurple</label>
      <input type="text" className="form-control" id="subDurple"></input>
    </div>

    <div className="form-group">
      <label for="title">Title</label>
      <input type="text" className="form-control" id="title"></input>
    </div>

    <div className="form-group">
      <label for="image">Image Link (url-link)</label>
      <input type="url" className="form-control" id="image"></input>
    </div>

    <div className="form-group">
      <label for="content">Content</label>
      <textarea className="form-control" id="content" rows="5"></textarea>
    </div>

    <input class="btn btn-primary" type="submit" value="Submit"></input>
    </form>
    </>
  )
}
