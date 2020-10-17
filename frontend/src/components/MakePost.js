import React,{useState} from "react";
import {Redirect} from "react-router-dom";
import '../styles/style.css';
import { Loading } from './Loading'
import { useDurpleContext, useSubAddress, useSubData } from '../hooks/Durple';
import { useParams } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';

export function MakePost() {
  const [redirect, setRedirect] = useState(false)
  const [waiting, setWaiting] = useState(false)
  const durple = useDurpleContext();
  const[title, setTitle] = useState("")
  const[image, setImage] = useState("")
  const[content, setContent] = useState("")
  const isImage = true

  const { subAddress } = useParams();

  useSubAddress();

  const subData = useSubData();
  let headerText = undefined;
  if (subData) headerText = "Welcome to d/"+subData.name;

  if (redirect) {
    return <Redirect to={"/d/"+subAddress}/>
  }
  return(
    <>
    {waiting?<Loading />:<></>}
    <form className="mt-4" onSubmit={async (e)=>{
      // make post
      e.preventDefault()
      if (waiting) return;
      setWaiting(true);
      const success = await durple.makePost(title, isImage, image, content)
      setWaiting(false);
      if (success)
        setRedirect(true)
    }}>
    <div className="container">
    <fieldset disabled={waiting}>

    <h3 className="mb-3">{headerText?headerText:<Skeleton />}</h3>
    <div className="form-group">
      <label htmlFor="title">Title</label>
      <input type="text" className="form-control" id="title" value={title} onChange={(e)=>{
        setTitle(e.target.value)
      }}></input>
    </div>

    <div className="form-group">
      <label htmlFor="image">Image Link (url-link)</label>
      <input type="url" className="form-control" id="image" value={image} onChange={(e)=>{
        setImage(e.target.value)
      }}></input>
    </div>

    <div className="form-group">
      <label htmlFor="content">Content</label>
      <textarea className="form-control" id="content" rows="5" value={content} onChange={(e)=>{
        setContent(e.target.value)
      }}></textarea>
    </div>

    <input className="btn btn-primary" type="submit" value="Submit"></input>
    </fieldset>
    </div>
    </form>
    </>
  )
}
