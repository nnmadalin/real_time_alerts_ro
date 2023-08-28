import { FaGithub, FaInstagram, FaFacebook, FaSearch} from "react-icons/fa";
import React, { useState, useEffect } from 'react';
import './App.css';
import SvgComponent from './svgcomponent';


export const get_judet = (id) => {
  var currentUrl = window.location.origin;
  currentUrl += "/" + id;
  window.location.replace(currentUrl);
};



function App() {
  useEffect(() => {
    console.log();
  });
  return (
    <>
      <div className={`container${window.location.pathname.length > 1 ? ' containerhidden' : ''}`} >
        <div className='title'>
          <h1>Alerte Meteo - România</h1>
          <h3>Neaună Mădălin</h3>
          <div className='social'>
            <a href='https://github.com/nnmadalin' target={"_blank"}><FaGithub /></a>
            <a href='https://www.instagram.com/nnmadalin/' target={"_blank"}><FaInstagram /></a>
            <a href='https://www.facebook.com/madalin.neauna' target={"_blank"}><FaFacebook /></a>
          </div>
        </div>
        <div className='contain'>
          <SvgComponent />
        </div>
      </div>
    </>
  );
}

export default App;
