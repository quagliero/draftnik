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
  listenForValueEvents(url, cb) {
    // only method that isn't `thenable` and requires inline callback
    db.ref(url).on('value', (snapshot) => {
      cb(snapshot.val());
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
