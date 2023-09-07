import { FaGithub, FaInstagram, FaFacebook, FaCalendarAlt } from "react-icons/fa";
import React, { useState, useEffect, useRef} from 'react';
import './App.css';
import { useCollapse } from 'react-collapsed';
import subscribeToTopic from './firebase.js';
import judeteRomania from './county.js';

function Collapsible({ json }) {
  const config = {
    duration: 500
  };
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse(config);
  return (
    <div className="card_alert">
      <div className="header" {...getToggleProps()}>
        <b>
          <FaCalendarAlt /> Dată primire: 
          { "   " + (new Date(json["sent"])).toLocaleDateString('ro-RO') + " " + (new Date(json["sent"])).toLocaleTimeString('ro-RO')}
        </b>
      </div>
      <div {...getCollapseProps()}>
        <div className="content">
          <div className="row">
            <b>Severitate: <span>{json["severity"]}</span></b>
          </div>
          <div className="row">
            <b>Certitudine: <span>{json["certainty"]}</span></b>
          </div>
          <div className="row">
            <b>Alertă în vigoare;</b>
            <p>De la: <span>{(new Date(json["onset"])).toLocaleDateString('ro-RO') + " " + (new Date(json["onset"])).toLocaleTimeString('ro-RO')}</span> până la: <span>{(new Date(json["expires"])).toLocaleDateString('ro-RO') + " " + (new Date(json["expires"])).toLocaleTimeString('ro-RO')}</span></p>
          </div>
          <div className="row">
            <b>Debutul evenimentului meteorologic:</b>
            <p><span>{(new Date(json["effective"])).toLocaleDateString('ro-RO') + " " + (new Date(json["effective"])).toLocaleTimeString('ro-RO')}</span></p>
          </div>
          <div className="row">
            <b>Descriere:</b>
            <p><span>{json["description"]}</span></p>
          </div>
          <div className="row">
            <b>Zone afectate:</b>
            <p>
              {json["county"].map((item, index) => (
                <span key={index}>
                  {item}{index < json["county"].length - 1 && ", "}
                </span>
              ))}  
            </p>
          </div>
          <div className="row">
            <b>Emis de:</b>
            <p><span>{json["senderName"]}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [jsondata, setJsonData] = useState(undefined);
  const [loading, setLoading] = useState(true); 
  const [searchCounty, setSearchCounty] = useState('');
  const [filteredJsonData, setFilteredJsonData] = useState([]);
  const [judetSelectat, setJudetSelectat] = useState('Alba');

  function api_call() {
    var url = "https://api.nnmadalin.me/ampr/";
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setJsonData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
  }

  const handleSelectChange = (event) => {
    setJudetSelectat(event.target.value);
  }

  useEffect(() => {
    api_call();
  }, []);

  useEffect(() => {
    const isSearchEmpty = searchCounty.trim() === "";

    const new_searchCounty = searchCounty.toLocaleLowerCase()
      .replace(/ă/g, 'a')
      .replace(/î/g, 'i')
      .replace(/â/g, 'a')
      .replace(/ș/g, 's')
      .replace(/ț/g, 's')
      ;

    if (jsondata) {
      if (!isSearchEmpty) {
        const filteredData = Object.values(jsondata).filter(item => {
          return item.county.some(county => {
            const normalizedCounty = county
              .replace(/ă/g, 'a')
              .replace(/î/g, 'i')
              .replace(/â/g, 'a')
              .replace(/ș/g, 's')
              .replace(/ț/g, 's')
              ;
      
            return normalizedCounty.toLocaleLowerCase().includes(new_searchCounty);
          });
        });
        setFilteredJsonData(filteredData);
      } else {
        setFilteredJsonData(Object.values(jsondata));
      }
    }
  }, [searchCounty, jsondata]);

  function subscribenews(){
      subscribeToTopic("ampr_" + judetSelectat);
  }

  return (
    <>
      <div className='container' >
        <div className='title'>
          <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/White_alert_icon.svg/1200px-White_alert_icon.svg.png' alt='alert-icon' />
          <h1>Alerte Meteo - România</h1>
          <br />
          <h3>Neaună Mădălin</h3>
          <div className='social'>
            <a href='https://github.com/nnmadalin' target={"_blank"}><FaGithub /></a>
            <a href='https://www.instagram.com/nnmadalin/' target={"_blank"}><FaInstagram /></a>
            <a href='https://www.facebook.com/madalin.neauna' target={"_blank"}><FaFacebook /></a>
          </div>
        </div>
        <div className='contain'>
          <div className="search">
            <input type='text' placeholder="Caută după județ!" value={searchCounty} onChange={(e) => setSearchCounty(e.target.value)}/>
            <div className="subscribe">
              <div className="select">
                <select onChange={handleSelectChange}>
                  {judeteRomania.map((judet, index) => (
                    <option key={index} value={judet.prescurtare}>{judet.nume}</option>
                  ))}
                </select>
              </div>
              <button onClick={subscribenews}>Abonare</button> 
            </div>
          </div>
          <div className="alerts">
            {loading ? (
              <img src='/output-onlinegiftools.gif' />
            ) : (
              // Folosiți filteredJsonData pentru a afișa doar datele filtrate
              filteredJsonData.reverse().map((item, key) => (
                <Collapsible key={key} json={item} />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
