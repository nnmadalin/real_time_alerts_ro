
import React, { useState, useEffect } from 'react';
import './App.css';
import SvgComponent from './svgcomponent';


export const get_judet = (id) => {
  var currentUrl = window.location.origin;
  currentUrl += "/" + id;
  window.location.replace(currentUrl);
};

function App() {
  const [isSubscribed, setIsSubscribed] = useState(false);

  const api_call = async () => {
    var url = "https://feeds.meteoalarm.org/api/v1/warnings/feeds-romania/";

    (async () => {
      try {
        const response = await fetch(url);
        const parsed = await response.json();
        console.log(parsed);
      } catch (error) {
        console.log("API error: " + error)
      }
    })();
  };


  useEffect(() => {

  })

  return (
    <>
      <div className='container'>
        <div className='title'>
          <h1>Alerte Meteo - România</h1>
          <h3>Neaună Mădălin</h3>
          <div className='social'></div>
        </div>
        <div className='contain'>
          <SvgComponent />
        </div>
      </div>
    </>
  );
}

export default App;
