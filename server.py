import requests
from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def root():
   index = 0
   req = requests.get('https://feeds.meteoalarm.org/api/v1/warnings/feeds-romania/')
   jsonreturn = {}
   dataro = req.json()
   for warnings in dataro["warnings"]:
      if warnings["alert"]["info"][0]["description"] != "N/A":
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

if __name__ == '__main__':
   app.run()