import axios from 'axios';
import { auth, db } from '../database';

export default {
  login(credentials, cb) {
    auth.signInWithEmailAndPassword(
      credentials.email,
      credentials.password,
    ).catch((error) => {
      cb(error);
    });
  },
  logout(cb) {
    auth.signOut().then(
      response => cb(response),
    );
  },
  getUsers(cb, error) {
    db.ref('users').once('value', (snapshot) => {
      cb(snapshot.val());
    }, err => error(err));
  },
  getDrafts(cb) {
    db.ref('drafts').once('value', (snapshot) => {
      cb(snapshot.val());
    });
  },
  getPickValuesBayesian(cb) {
    axios.get('/static/data/pick-values-bayesian.json')
    .then(response => cb(response));
  },
  getPlayers(cb) {
    axios.get('/static/data/players.json')
    .then(response => cb(response));
  },
  getAdp(cb) {
    axios.get('/static/data/adp.json')
    .then(response => cb(response));
  },
};
