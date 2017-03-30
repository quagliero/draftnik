import * as firebase from 'firebase';

const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: 'draftnik-cc54e.firebaseapp.com',
  databaseURL: 'https://draftnik-cc54e.firebaseio.com',
  storageBucket: 'draftnik-cc54e.appspot.com',
  messagingSenderId: '730103024847',
};

firebase.initializeApp(config);

export const db = firebase.database();
export const auth = firebase.auth();

window.db = db;
