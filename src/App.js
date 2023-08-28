import { Hint } from 'react-autocomplete-hint';
import React, { useState, useEffect } from 'react';
import './App.css';


function App() {
  const options = [
    "Alba", "Arad", "Argeș", "Bacău", "Bihor", "Bistrița-Năsăud", "Botoșani",
    "Brăila", "Brașov", "București", "Buzău", "Călărași", "Caraș-Severin",
    "Cluj", "Constanța", "Covasna", "Dâmbovița", "Dolj", "Galați", "Giurgiu",
    "Gorj", "Harghita", "Hunedoara", "Ialomița", "Iași", "Ilfov", "Maramureș",
    "Mehedinți", "Mureș", "Neamț", "Olt", "Prahova", "Sălaj", "Satu Mare",
    "Sibiu", "Suceava", "Teleorman", "Timiș", "Tulcea", "Vâlcea", "Vaslui", "Vrancea"
  ];

  const handleInputChange = (value) => {
    // Extrage prima valoare detectată din hint (dacă există)
    const firstMatch = options.find(option => option.toLowerCase().includes(value.toLowerCase()));
    console.log('Prima valoare din hint:', firstMatch);
  };

  const api_call = async () =>{
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
    api_call();
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
          <Hint options={options}>
            <input
              type="text"
              placeholder='Caută un județ!'
              onChange={(e) => handleInputChange(e.target.value)}
            />
          </Hint>
          <button>Notifică-mă</button>
        </div>
      </div>
    </>
  );
}

export default App;
