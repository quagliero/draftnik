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
  resetPassword(email, cb) {
    auth.sendPasswordResetEmail(email).then(() => {
      cb(email);
    }, (err) => {
      cb(err);
    });
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
  getWatchlist(user, cb) {
    db.ref(`watchlists/${user}`).on('value', (snapshot) => {
      cb(snapshot.val());
    });
  },
  addToWatchlist(user, player, cb) {
    db.ref(`watchlists/${user}/${player.id}`).set(true, (err) => {
      if (!err) {
        cb(player);
      }
    });
  },
  removeFromWatchlist(user, player, cb) {
    db.ref(`watchlists/${user}/${player.id}`).set(null, (err) => {
      if (!err) {
        cb(player);
      }
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
