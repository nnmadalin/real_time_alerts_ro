import { FaGithub, FaInstagram, FaFacebook, FaCalendarAlt } from "react-icons/fa";
import React, { useState, useEffect, useRef} from 'react';
import './App.css';
import { useCollapse } from 'react-collapsed';

export const get_judet = (id) => {
  var currentUrl = window.location.origin;
  currentUrl += "/" + id;
  window.location.replace(currentUrl);
};

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
            <p>De la: <span>{(new Date(json["onset"])).toLocaleDateString('ro-RO') + " " + (new Date(json["onset"])).toLocaleTimeString('ro-RO')}</span> până la: <span>{(new Date(json["expires"])).toLocaleTimeString('ro-RO') + " " + (new Date(json["expires"])).toLocaleTimeString('ro-RO')}</span></p>
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

  useEffect(() => {
    api_call();
  }, []);


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
            <input type='text' placeholder="Caută după județ!"/>
            <button>Abonare</button>
          </div>
          <div className="alerts">
            {loading ? (
              <img src='/output-onlinegiftools.gif' />
            ) :(
              Object.keys(jsondata).map((key) => {
                const item = jsondata[key];
                return (
                  <>
                    <Collapsible json={item} />
                  </>
                );
              })
            )
            }
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
