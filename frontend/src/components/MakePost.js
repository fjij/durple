import React,{useState} from "react";
import {Redirect} from "react-router-dom";
import '../styles/style.css';
import { useDurpleContext } from '../hooks/Durple';

export function MakePost() {
  const[redirect, setRedirect] = useState(false)
  const durple = useDurpleContext();
  const[subDurple, setSubDurple] = useState("")
  const[title, setTitle] = useState("")
  const[image, setImage] = useState("")
  const[content, setContent] = useState("")
  const isImage = true

  if (redirect) {
    return <Redirect to="/SubDurpleHome"/>

  }
  return(
    <>
    <form className="mt-4" onSubmit={(e)=>{
      e.preventDefault()
      durple.makePost(title, isImage, image, content)
      setRedirect(true)
    }}>
    <div className="container">
    <div className="form-group">
      <label for="subDurple">SubDurple</label>
      <input type="text" className="form-control" id="subDurple" value={subDurple} onChange={(e)=>{
        setSubDurple(e.target.value)
      }}></input>
    </div>

    <div className="form-group">
      <label for="title">Title</label>
      <input type="text" className="form-control" id="title" value={title} onChange={(e)=>{
        setTitle(e.target.value)
      }}></input>
    </div>

    <div className="form-group">
      <label for="image">Image Link (url-link)</label>
      <input type="url" className="form-control" id="image" value={image} onChange={(e)=>{
        setImage(e.target.value)
      }}></input>
    </div>

    <div className="form-group">
      <label for="content">Content</label>
      <textarea className="form-control" id="content" rows="5" value={content} onChange={(e)=>{
        setContent(e.target.value)
      }}></textarea>
    </div>

    <input class="btn btn-primary" type="submit" value="Submit"></input>
    </div>
    </form>
    </>
  )
}
