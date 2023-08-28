
import React, { useState, useEffect } from 'react';
import './info_county.css';


function InfoCounty() {

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

   useEffect(() => {

   })


   return (
      <>
         <div className="cardInfo">
            <div className='card'>
               <div className='top'>
                  <h1>Alerte pentru: </h1>
                  <button onClick={close_page}>X</button>
               </div>
            </div>
         </div>
      </>
   );
}

export default InfoCounty;
