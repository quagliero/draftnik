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
  getWatchlist(draft, user, cb) {
    db.ref(`watchlists/${draft}/${user}/`).on('value', (snapshot) => {
      cb(snapshot.val());
    });
  },
  addToWatchlist(draft, user, player, cb) {
    db.ref(`watchlists/${draft}/${user}/${player.id}`).set(true, (err) => {
      if (!err) {
        cb(player);
      }
    });
  },
  removeFromWatchlist(draft, user, player, cb) {
    db.ref(`watchlists/${draft}/${user}/${player.id}`).set(null, (err) => {
      if (!err) {
        cb(player);
      }
    });
  },
  getTrade(draft, tradeId, cb) {
    db.ref(`trades/${draft}/${tradeId}`).on('value', (snapshot) => {
      cb(snapshot.val());
    });
  },
  /* eslint-disable */
  getUserTrades(draft, user, cb) {
    const tradesRef = db.ref(`trades/${draft}`);
    db.ref(`tradesUsersPivot/${draft}/${user}`).on('value', (snapshot) => {
      const tradeIds = snapshot.val();
      Promise.all(
        Object.keys(tradeIds).map(
          id => tradesRef.child(id).once('value').then((trade) => trade.val())
        )
      ).then((values) => cb(values));
    });

    // cb(Promise.all(tradeIds.map()))
    // .on('value', (snapshot) => {
    //   console.log('inPivot', snapshot.val());
    //   snapshot.forEach((trade) => {
    //     console.log(trade);
    //     tradesRef.child(trade.key).on('value', (snap) => {
    //       console.log('in trade');
    //       cb(snap);
    //     });
    //   });
    // });
  },
  proposeTrade(draft, trade, cb) {
    const tradeKey = db.ref('trades').push().key;
    // create references to this trade on the user first
    // so we can use firebase rules to restrict access
    db.ref(`trades/${draft}/${tradeKey}`).set({
      id: tradeKey,
      givingTeam: trade.givingTeam,
      receivingTeam: trade.receivingTeam,
      givingPicks: trade.givingPicks,
      receivingPicks: trade.receivingPicks,
      isAccepted: false,
      seen: false,
    }, (error) => {
      if (!error) {
        db.ref(`tradesUsersPivot/${draft}/${trade.givingTeam}/${tradeKey}`).set(true);
        db.ref(`tradesUsersPivot/${draft}/${trade.receivingTeam}/${tradeKey}`).set(true);
        cb(trade);
      }
    });
  },
  counterTrade(draft, trade, cb) {
    const tradeKey = db.ref('trades').push().key;
    db.ref(`trades/${draft}/${tradeKey}`).set({
      id: tradeKey,
      givingTeam: trade.givingTeam,
      receivingTeam: trade.receivingTeam,
      givingPicks: trade.givingPicks,
      receivingPicks: trade.receivingPicks,
      isAccepted: false,
      seen: false,
      counters: trade.id,
    }, (err) => {
      if (!err) {
        cb(trade);
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
