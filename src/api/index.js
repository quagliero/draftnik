import axios from 'axios';
import { auth } from '../database';

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
  getTeams(cb) {
    axios.get(`${process.env.API_URL}/users`)
    .then(response => cb(response));
  },
  getDrafts(cb) {
    axios.get('/static/data/drafts.json')
    .then(response => cb(response));
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
