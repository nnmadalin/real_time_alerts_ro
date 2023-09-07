import { initializeApp } from "firebase/app";
import { getMessaging, getToken, } from 'firebase/messaging';
import Cookies from 'js-cookie'

const firebaseConfig = {
   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
   appId: process.env.REACT_APP_FIREBASE_APP_ID
};


const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

async function subscribeToTopic(topic) {
   const token = await requestPermission();

   fetch(`https://iid.googleapis.com/iid/v1/${token}/rel/topics/${topic}`, {
      method: 'POST',
      headers: {
         Authorization: `key=` + process.env.REACT_APP_FIREBASE_SECRET_KEY,
      },
   })
      .then(response => {
         if (response.ok) {
            console.log(`Subscribed to topic: ${topic}`);
            alert("Te-ai abonat cu succes!");
         } else {
            console.error(`Error subscribing to topic`);
            alert("Ceva nu a functionat bine! Verifica logs!");
         }
      })
      .catch(error => {
         console.error(error);
         alert("Ceva nu a functionat bine! Verifica logs!");
      });
}

async function unsubscribe(topic) {

   const token = await requestPermission();

   fetch(`https://iid.googleapis.com/iid/v1/${token}/rel/topics/${topic}`, {
      method: 'DELETE',
      headers: {
         Authorization: `key=${process.env.REACT_APP_FIREBASE_SECRET_KEY}`,
      },
   })
      .then(response => {
         if (response.ok) {
            console.log(`Unsubscribed to topic: ${topic}`);
            alert("Te-ai dezabonat cu succes!");
         } else {
            console.error(`Error unsubscribing to topic`);
            alert("Ceva nu a functionat bine! Verifica logs!");
         }
      })
      .catch(error => {
         console.error(error);
         alert("Ceva nu a functionat bine! Verifica logs!");
      });

}

async function requestPermission() {
   return new Promise((resolve) => {
      console.log("Requesting permission...");
      Notification.requestPermission().then((permission) => {
         if (permission === "granted") {
            const app = initializeApp(firebaseConfig);

            const messaging = getMessaging(app);
            getToken(messaging, {
               vapidKey:
                  process.env.REACT_APP_FIREBASE_KEY_PAIR,
            }).then((currentToken) => {
               if (currentToken) {
                  console.log("firebase key detect");
                  resolve(currentToken);
               } else {
                  console.log("firebase no key")
                  resolve("");
               }
            });
         } else {
            console.log("Do not have permission!");
            resolve("");
         }
      });
   });
}

export { subscribeToTopic, unsubscribe };