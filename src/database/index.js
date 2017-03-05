import Vue from 'vue';
import VuexFire from 'vuexfire';
import * as firebase from 'firebase';

Vue.use(VuexFire);

const config = {
  apiKey: 'AIzaSyDN1Oc2KK4X33MlaqWXbFkjvybmiFl3hac',
  authDomain: 'draftnik-cc54e.firebaseapp.com',
  databaseURL: 'https://draftnik-cc54e.firebaseio.com',
  storageBucket: 'draftnik-cc54e.appspot.com',
  messagingSenderId: '730103024847',
};

firebase.initializeApp(config);

export const db = firebase.database();
export const auth = firebase.auth();
