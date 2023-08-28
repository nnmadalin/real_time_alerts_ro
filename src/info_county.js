import React, { useState, useEffect } from 'react';
import './info_county.css';


function InfoCounty() {

   const [loading, setLoading] = useState(true);

   const [transmission, Settransmission] = useState('undefined');
   const [reception, Setreception] = useState('undefined');
   const [expiry, Setexpiry] = useState('undefined');
   const [status, Setstatus] = useState('undefined');
   const [certainty, Setcertainty] = useState('undefined');
   const [severity, Setseverity] = useState('undefined');
   const [description, Setdescription] = useState('undefined');
   const [color, Setcolor] = useState('undefined');

   const options = [
      "Alba", "Arad", "Argeș", "Bacău", "Bihor", "Bistrița-Năsăud", "Botoșani",
      "Brăila", "Brașov", "București", "Buzău", "Călărași", "Caraș-Severin",
      "Cluj", "Constanța", "Covasna", "Dâmbovița", "Dolj", "Galați", "Giurgiu",
      "Gorj", "Harghita", "Hunedoara", "Ialomița", "Iași", "Ilfov", "Maramureș",
      "Mehedinți", "Mureș", "Neamț", "Olt", "Prahova", "Sălaj", "Satu Mare",
      "Sibiu", "Suceava", "Teleorman", "Timiș", "Tulcea", "Vâlcea", "Vaslui", "Vrancea"
   ];
   const options_shortcut = [
      "AB", "AR", "AG", "BC", "BH", "BN", "BT",
      "BR", "BV", "B", "BZ", "CL", "CS", "CJ",
      "CT", "CV", "DB", "DJ", "GL", "GR", "GJ",
      "HR", "HD", "IL", "IS", "IF", "MM", "MH",
      "MS", "NT", "OT", "PH", "SM", "SJ", "SB",
      "SV", "TR", "TM", "TL", "VL", "VS", "VN"
   ];

   const close_page = () => {
      window.location.replace(window.location.origin);
   }
   function convertToLocalTime(dateTimeString) {
      const date = new Date(dateTimeString);
      const options = {
         year: 'numeric',
         month: 'long',
         day: 'numeric',
         hour: 'numeric',
         minute: 'numeric',
      };

      return date.toLocaleString('ro-RO', options);
   }

   const api_call = async () => {
      var url = "http://127.0.0.1:8080" + "/api/" + options[options_shortcut.indexOf(window.location.pathname.substring(1))];
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
               Settransmission(parsed.senderName);
               Setreception(convertToLocalTime(parsed.onset));
               Setexpiry(convertToLocalTime(parsed.expires));
               if(convertToLocalTime(parsed.expires) < new Date() && convertToLocalTime(parsed.onset) >= new Date())
                  Setstatus("Expired");
               else if(convertToLocalTime(parsed.onset) >= new Date())
                  Setstatus("Ongoing");
               else
               Setstatus("Future");
               Setcertainty(parsed.certainty);
               Setseverity(parsed.severity);
               Setdescription(parsed.headline);

               var color = (parsed.awareness_level); color = color.split(";");
               Setcolor(color[1]);
            }

         } catch (error) {
            console.log("API error: " + error)
         }
      })();
   };

   useEffect(() => {
      if (options_shortcut.indexOf(window.location.pathname.substring(1)) == -1)
         window.location.replace(window.location.origin);
      api_call();
      setTimeout(() => {
         setLoading(false); // După un interval de timp, setăm starea la false pentru a opri încărcarea
      }, 2000);
   })

   const divStyle = {
      border: `3px solid ${color}` // Stilul pentru border cu culoarea din variabilă
   };

   return (
      <>
         {loading ? (
            <div className="loading">
               <img src='./02-45-27-186_512.webp'></img>
            </div>
         ) : (
            <div className="cardInfo">
               <div className='card'>
                  <div className='top'>
                     <h1>
                        {
                           options[options_shortcut.indexOf(window.location.pathname.substring(1))]
                        }
                     </h1>
                     <button onClick={close_page}>X</button>
                  </div>
                  <div className='scroll'>
                     <div className='infoalert' style={divStyle}>
                        <div className='row'>Transmis de: <b>{transmission}</b></div>
                        <div className='group'>
                           <div className='row'>Dată primire: <b>{reception}</b></div>
                           <div className='row'>Dată Expirare: <b>{expiry}</b></div>
                           <div className='row'>Status: <b>{status}</b></div>
                        </div>
                        <div className='group'>
                           <div className='row'>Certitudine: <b>{certainty}</b></div>
                           <div className='row'>Severitate: <b>{severity}</b></div>
                        </div>
                        <div className='row'>Descriere: <br /><p><b>{description}</b></p></div>
                        <div className='color_alert'>Culoarea alertei: <b>{color}</b></div>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </>
   );
}

export default InfoCounty;
