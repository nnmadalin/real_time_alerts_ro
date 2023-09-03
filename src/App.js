import { FaGithub, FaInstagram, FaFacebook, FaSearch } from "react-icons/fa";
import React, { useState, useEffect } from 'react';
import './App.css';
import SvgComponent from './svgcomponent';


export const get_judet = (id) => {
  var currentUrl = window.location.origin;
  currentUrl += "/" + id;
  window.location.replace(currentUrl);
};

function App() {
  const [loading, setLoading] = useState(true);
  const [error_api, seterror] = useState(false);
  const [apicall, setapicall] = useState(true);

  const county = [
    "Alba", "Arad", "Argeș", "Bacău", "Bihor", "Bistrița-Năsăud", "Botoșani",
    "Brăila", "Brașov", "București", "Buzău", "Călărași", "Caraș-Severin",
    "Cluj", "Constanța", "Covasna", "Dâmbovița", "Dolj", "Galați", "Giurgiu",
    "Gorj", "Harghita", "Hunedoara", "Ialomița", "Iași", "Ilfov", "Maramureș",
    "Mehedinți", "Mureș", "Neamț", "Olt", "Prahova", "Sălaj", "Satu Mare",
    "Sibiu", "Suceava", "Teleorman", "Timiș", "Tulcea", "Vâlcea", "Vaslui", "Vrancea"
  ];

  const api_call = async () => {
    if(apicall == true){
      setapicall(false);
      const totalCount = county.length; 
      let completedCount = 0; 
      try{
        for (const element of county) {
          var url = "http://127.0.0.1:8080" + "/api/county/" + element;
          //var url = window.location.origin + "/api/" + options[options_shortcut.indexOf(window.location.pathname.substring(1))];

          const dataToSend = {
            api_token: process.env.REACT_APP_API_KEY
          };
          (async () => {
            try {
              const response = await fetch(url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend)
              });

              if (!response.ok) {
                console.log("API reponse status code: " + response.status);
              }
              else {
                const parsed = await response.json();
                if(parsed == null)
                  console.log("aici");
                console.log(parsed);
              }
              completedCount++; 
              if (completedCount === totalCount) {
                setLoading(false); 
              }
            } catch (error) {
              console.log("API error1: " + error);
              setLoading(false);
              seterror(true);
            }
          })();
        };
        
      }
      catch(error){
        console.log("API error: " + error);
        setLoading(false); 
        alert("Ceva nu a mers bine cu API");
      }
    }
    if(error_api == true)
      alert("Ceva nu a mers bine cu API");
  };

  useEffect(() => {
    if (window.location.pathname == "/")
      api_call();
    else
      setLoading(false);
      
  })

  return (
    <>
      {loading ? (
        <div className="loading">
            <img src='./02-45-27-186_512.webp'></img>
        </div>
      ) : (
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
      )}
    </>
  );
}

export default App;
