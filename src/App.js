import { FaGithub, FaInstagram, FaFacebook, FaSearch } from "react-icons/fa";
import React, { useState, useEffect } from 'react';
import './App.css';
import { useCollapse } from 'react-collapsed';



export const get_judet = (id) => {
  var currentUrl = window.location.origin;
  currentUrl += "/" + id;
  window.location.replace(currentUrl);
};

function Collapsible({ json, index }) {
  json = JSON.parse(json);
  const config = {
      duration: 500
  };
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse(config);
return (
  <div className="card_alert">
      <div className="header" {...getToggleProps()}>
        <b>
        {json[index]["sent"]}
        </b>
      </div>
      <div {...getCollapseProps()}>
          <div className="content">
              Now you can see the hidden content. <br/><br/>
              Click again to hide...
          </div>
      </div>
  </div>
  );
}

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

  })

  return (
    <>
      <div className='container' >
        <div className='title'>
          <img src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/White_alert_icon.svg/1200px-White_alert_icon.svg.png' alt='alert-icon' />
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
            <Collapsible json='{"0":{"certainty":"Likely","county":["Alba","Arad","Argeș","Bacău","Bihor","Bistrița-Năsăud","Botoșani","Brașov","Buzău","Caraș-Severin","Cluj","Covasna","Dâmbovița","Gorj","Harghita","Hunedoara","Iași","Maramureș","Mehedinți","Mureș","Neamț","Prahova","Satu Mare","Sălaj","Sibiu","Suceava","Timiș","Vaslui","Vâlcea","Vrancea"],"description":"Vor fi averse și cu caracter torențial, descărcări electrice, intensificări ale vântului (în general cu rafale de 55...70 km/h), pe arii restrânse vijelii și grindină. În intervale scurte de timp sau prin acumulare cantitățile de apă vor fi de 20...25 l/mp și izolat peste 40 l/mp.","effective":"2023-09-03T09:40:00+03:00","expires":"2023-09-04T06:00:00+03:00","onset":"2023-09-03T10:00:00+03:00","senderName":"Administrația Națională de Meteorologie","sent":"2023-09-03T10:01:15+03:00","severity":"Moderate"}}' index={0}/>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
