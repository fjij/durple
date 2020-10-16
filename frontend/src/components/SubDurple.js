import React from "react";
import '../styles/style.css';
import { Cards } from "./Cards";

export function SubDurple() {
  const subD = "d/ " + "Funny"
  return (
    <>
      <div className="container text-center">
      <h1 className="subTitle">{subD}</h1>
    </div>
    <Cards />
    </>
  )
}
