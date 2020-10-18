import React, { useState } from "react";
import '../styles/style.css';
import logo from '../assets/logo.png'
import {useProfileData} from '../hooks/Durple'
import Skeleton from 'react-loading-skeleton';
import { Redirect } from 'react-router-dom';
export function About() {
  const profileData = useProfileData();
  const [redirect, setRedirect] = useState(undefined);

  if (redirect) {
    return <Redirect to={redirect}/>
  }

  function Buttons() {
    if (profileData) {
      return (<>
        {
          profileData.featured.map(f => {
            const link = "/d/" + f.address;
            return (<button key={f.address} className="btn btn-outline-primary mr-2" onClick={() => setRedirect(link)}>
              d/{f.name}
            </button>);
          })
        }
      </>);
    } else {
      return (<>
        <button className="btn btn-outline-primary mr-2"><Skeleton width={50}/></button>
        <button className="btn btn-outline-primary"><Skeleton width={50}/></button>
        <button className="btn btn-outline-primary ml-2"><Skeleton width={50}/></button>
      </>);
    }
  }

  return (
  <>
  <div className="container-fluid">
  <div className="aboutCenter">
    <img src={logo} alt="Durple Logo"></img>
    <h1 className="mt-4">The Future of Forums</h1>
    <h5>Durple is the future of the internet. Updurp or Downdurp. </h5>
    <h5>Uplurkle or Lurkle. Join now and be a Durple.</h5>
    <div className="mt-4">
    <Buttons />
    </div>
  </div>
  </div>
  </>
);
}
