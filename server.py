# -*- coding: utf-8 -*-


import requests
import pyrebase
from flask import Flask, jsonify
from dateutil import parser
from datetime import datetime
from dotenv import load_dotenv
import os
import pytz
import json


load_dotenv()


app = Flask(__name__)

app.config['JSON_AS_ASCII'] = False

config = {
   "apiKey": os.getenv('REACT_APP_FIREBASE_API_KEY'),
   "authDomain": os.getenv('REACT_APP_FIREBASE_AUTH_DOMAIN'),
   "projectId": os.getenv('REACT_APP_FIREBASE_PROJECT_ID'),
   "databaseURL": os.getenv('REACT_APP_FIREBASE_DATABASE_URL'),
   "storageBucket": os.getenv('REACT_APP_FIREBASE_STORAGE_BUCKET'),
   "messagingSenderId": os.getenv('REACT_APP_FIREBASE_MESSAGING_SENDER_ID'),
   "appId": os.getenv('REACT_APP_FIREBASE_APP_ID')
}


@app.route('/')
def root():
   index = 0
   req = requests.get('https://feeds.meteoalarm.org/api/v1/warnings/feeds-romania/')
   jsonreturn = {}
   dataro = req.json()
   datanow = datetime.now(pytz.timezone('Europe/Bucharest'))
   for warnings in dataro["warnings"]:
      datawarning = parser.parse(warnings["alert"]["info"][0]["expires"]).astimezone(pytz.timezone('Europe/Bucharest'))
      if (warnings["alert"]["info"][0]["description"] != "N/A" and datawarning >= datanow):
         county = []
         for zone in warnings["alert"]["info"][0]["area"]:
            county.append(zone["areaDesc"])

         jsonchild = {
            "sent": warnings["alert"]["sent"],
            "certainty": warnings["alert"]["info"][0]["certainty"],
            "severity": warnings["alert"]["info"][0]["severity"],
            "description": warnings["alert"]["info"][0]["description"],
            "onset": warnings["alert"]["info"][0]["onset"],
            "effective": warnings["alert"]["info"][0]["effective"],
            "expires": warnings["alert"]["info"][0]["expires"],
            "senderName": warnings["alert"]["info"][0]["senderName"],
            "county": county,
         }
         jsonreturn[index] = jsonchild
         index = index + 1
   return jsonify(jsonreturn)

@app.route('/check_api_notify')
def root_2():
   index = 0
   req = requests.get('https://feeds.meteoalarm.org/api/v1/warnings/feeds-romania/')
   jsonreturn = {}
   dataro = req.json()
   datanow = datetime.now(pytz.timezone('Europe/Bucharest'))

   firebase = pyrebase.initialize_app(config)
   database = firebase.database()

   element_id = database.child("id").get().val()
   
   is_find = False

   for warnings in dataro["warnings"]:
      datawarning = datetime.fromisoformat(warnings["alert"]["info"][0]["expires"])
      if(warnings["uuid"] == element_id):
         element_id = warnings["uuid"]
         is_find = True
      elif (warnings["alert"]["info"][0]["description"] != "N/A" and datawarning >= datanow and is_find == False):
         data = {
            "to": "/topics/ampr_TOATE",
            "notification": {
               "title": "Alerta Meteo - National - " + warnings["alert"]["info"][0]["severity"],
               "body": warnings["alert"]["info"][0]["description"]
            }
         }

         headers = {
            "Authorization": "key=" + os.getenv("SEVER_TOKEN")
         }
         respondes = requests.post("https://fcm.googleapis.com/fcm/send", json=data, headers=headers)
         for zone in warnings["alert"]["info"][0]["area"]:
            data = {
               "to": "/topics/ampr_" + gaseste_prescurtare(zone["areaDesc"]),
               "notification": {
                  "title": "Alerta Meteo - " + zone["areaDesc"] + " - " + warnings["alert"]["info"][0]["severity"],
                  "body": warnings["alert"]["info"][0]["description"]
               }
            }
            respondes = requests.post("https://fcm.googleapis.com/fcm/send", json=data, headers=headers)

         

   database.child("").update({"id": dataro["warnings"][0]["uuid"]})
   return  jsonify({})


def gaseste_prescurtare(denumire):
   for judet in judeteRomania:
      if judet['nume'] == denumire:
         return judet['prescurtare']
   return ""

judeteRomania = [
   { "prescurtare": "TOATE", "nume": "Toate Judetele" },
   { "prescurtare": "AB", "nume": "Alba" },
   { "prescurtare": "AR", "nume": "Arad" },
   { "prescurtare": "AG", "nume": "Argeș" },
   { "prescurtare": "BC", "nume": "Bacău" },
   { "prescurtare": "BH", "nume": "Bihor" },
   { "prescurtare": "BN", "nume": "Bistrița-Năsăud" },
   { "prescurtare": "BR", "nume": "Brăila" },
   { "prescurtare": "BT", "nume": "Botoșani" },
   { "prescurtare": "BV", "nume": "Brașov" },
   { "prescurtare": "BR", "nume": "Brăila" },
   { "prescurtare": "BZ", "nume": "Buzău" },
   { "prescurtare": "CS", "nume": "Caraș-Severin" },
   { "prescurtare": "CL", "nume": "Călărași" },
   { "prescurtare": "CJ", "nume": "Cluj" },
   { "prescurtare": "CT", "nume": "Constanța" },
   { "prescurtare": "CV", "nume": "Covasna" },
   { "prescurtare": "DB", "nume": "Dâmbovița" },
   { "prescurtare": "DJ", "nume": "Dolj" },
   { "prescurtare": "GL", "nume": "Galați" },
   { 'prescurtare': "GR", "nume": "Giurgiu" },
   { "prescurtare": "GJ", "nume": "Gorj" },
   { "prescurtare": "HR", "nume": "Harghita" },
   { "prescurtare": "HD", 'nume': "Hunedoara" },
   { "prescurtare": "IL", 'nume': "Ialomița" },
   { "prescurtare": "IS", "nume": "Iași" },
   { "prescurtare": "IF", "nume": "Ilfov" },
   { "prescurtare": "MM", "nume": "Maramureș" },
   { 'prescurtare': "MH", "nume": "Mehedinți" },
   { "prescurtare": "MS", "nume": "Mureș" },
   { "prescurtare": "NT", "nume": "Neamț" },
   { "prescurtare": "OT", "nume": "Olt" },
   { "prescurtare": "PH", "nume": "Prahova" },
   { "prescurtare": "SM", "nume": "Satu Mare" },
   { "prescurtare": "SJ", "nume": "Sălaj" },
   { "prescurtare": "SB", "nume": "Sibiu" },
   { "prescurtare": "SV", "nume": "Suceava" },
   { "prescurtare": "TR", "nume": "Teleorman" },
   { "prescurtare": "TM", "nume": "Timiș" },
   { "prescurtare": "TL", "nume": "Tulcea" },
   { "prescurtare": "VS", "nume": "Vâlcea" },
   { "prescurtare": "VL", 'nume': "Vaslui" },
   { "prescurtare": "VN", "nume": "Vrancea" }
]

if __name__ == '__main__':
   app.run()