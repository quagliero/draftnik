import axios from 'axios';
import { auth, db } from '../database';
import { TradeStatus } from '../constants';

window.axios = axios;

const listenForValueEvents = (url, cb) => {
  db.ref(url).on('value', snapshot => {
    cb(snapshot.val());
  });
};

const from = Math.floor(new Date() / 8.64e7);

export default {
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
  getUsers() {
    return db.ref('users').once('value');
  },
  getDrafts() {
    return db.ref('drafts').once('value');
  },
  getWatchlist(draft, user, cb) {
    listenForValueEvents(`watchlists/${draft}/${user}`, cb);
  },
  addToWatchlist(draft, user, player) {
    return db.ref(`watchlists/${draft}/${user}/${player.id}`).set(true);
  },
  removeFromWatchlist(draft, user, player) {
    return db.ref(`watchlists/${draft}/${user}/${player.id}`).set(null);
  },
  getAcceptedTrades(draft, cb) {
    listenForValueEvents(`tradesAccepted/${draft}`, cb);
  },
  getTrade({ draft, id }) {
    return db.ref(`trades/${draft}/${id}`).once('value');
  },
  getUserTrades(draft, user, cb) {
    listenForValueEvents(`tradesUsersPivot/${draft}/${user}`, cb);
  },
  proposeTrade({ draft, tradeKey, payload }) {
    // create references to this trade on the user first
    // so we can use firebase rules to restrict access
    return db.ref(`trades/${draft}/${tradeKey}`).set(payload);
  },
  addTradeToUser(draft, user, tradeKey) {
    return db.ref(`tradesUsersPivot/${draft}/${user}/${tradeKey}`).set(true);
  },
  rejectTrade({ draft, trade }) {
    return db.ref(`trades/${draft}/${trade}`).update({
      status: TradeStatus.REJECTED,
    });
  },
  withdrawTrade({ draft, trade }) {
    return db.ref(`trades/${draft}/${trade}`).update({
      status: TradeStatus.WITHDRAWN,
    });
  },
  acceptTrade({ draft, trade }) {
    return db.ref(`trades/${draft}/${trade}`).update({
      status: TradeStatus.ACCEPTED,
    });
  },
  addTradeToAccepted({ draft, trade }) {
    return db.ref(`tradesAccepted/${draft}/${trade}`).set(true);
  },
  changePickOwner({ draft, pick, team }) {
    return db.ref(`drafts/${draft}/picks/${pick}/team`).set(team);
  },
  counterTrade(draft, trade, cb) {
    const tradeKey = db.ref('trades').push().key;
    db.ref(`trades/${draft}/${tradeKey}`).set({
      id: tradeKey,
      givingTeam: trade.givingTeam,
      receivingTeam: trade.receivingTeam,
      givingPicks: trade.givingPicks,
      receivingPicks: trade.receivingPicks,
      status: TradeStatus.OFFERED,
      seen: false,
      counters: trade.id,
    }, (err) => {
      if (!err) {
        cb(trade);
      }
    });
  },
  getPickValuesBayesian() {
    return axios.get('/static/data/pick-values-bayesian.json');
  },
  getPlayers() {
    return axios.get('/static/data/players.json');
  },
  getAdp() {
    return axios.get(`/static/data/adp.json?timestamp=${from}`);
  },
};
