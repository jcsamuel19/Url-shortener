import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // import this
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initializeApp } from "firebase/app";

// Paste config from firebase
const firebaseConfig = {
  apiKey: "AIzaSyAuRsTQ5D07XeUaKuuwxDeOZ_K-on4ivCA",
  authDomain: "url-shortener-21e07.firebaseapp.com",
  projectId: "url-shortener-21e07",
  storageBucket: "url-shortener-21e07.appspot.com",
  messagingSenderId: "476238466032",
  appId: "1:476238466032:web:abbf3a616b06a76116eb35",
  measurementId: "G-QH72R30R57"
};

initializeApp(firebaseConfig); // config firebase to talk to app

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter> 
    <App />
  </BrowserRouter>
);
// change these to BrowserRouter^

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

