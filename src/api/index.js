import axios from 'axios';
import { auth, db } from '../database';

export default {
  get(url) {
    return axios.get(url);
  },
  login(credentials) {
    return auth.signInWithEmailAndPassword(
      credentials.email,
      credentials.password,
    );
  },
  logout() {
    return auth.signOut();
  },
  resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  },
  once(url) {
    return db.ref(url).once('value');
  },
  // the firebase 'listen' events aren't promises, so pass in the raw response
  // to be used with an inline callback
  listenForValueEvents(url, cb) {
    db.ref(url).on('value', (snapshot) => {
      cb(snapshot);
    });
  },
  listenForAddedEvents(url, cb) {
    db.ref(url).on('child_added', (snapshot) => {
      cb(snapshot);
    });
  },
  listenForChangeEvents(url, cb) {
    db.ref(url).on('child_changed', (snapshot) => {
      cb(snapshot);
    });
  },
  set(url, payload) {
    return db.ref(url).set(payload);
  },
  update(url, payload) {
    return db.ref(url).update(payload);
  },
  remove(url) {
    return db.ref(url).remove();
  },
};
