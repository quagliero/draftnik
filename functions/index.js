/* eslint-disable no-console */
const axios = require('axios');
const parser = require('xml2json');
const cors = require('cors')({
  origin: true,
});
const map = require('lodash.map');
const keys = require('lodash.keys');
const forEach = require('lodash.foreach');
const some = require('lodash.some');
const admin = require('firebase-admin');
const functions = require('firebase-functions');

// @TODO make this shared from the main project
const TradeStatus = {
  OFFERED: 'OFFERED',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  WITHDRAWN: 'WITHDRAWN',
};

// const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);

admin.initializeApp();

// fetch player data from FFC
exports.fetchPlayerData = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    axios.get('https://fantasyfootballcalculator.com/adp_xml.php?format=standard&teams=12')
      .then((response) => {
        const data = parser.toJson(response.data, { object: true });
        res.json(data.root);
      })
      .catch((err) => {
        res.send(err.response);
      });
  });
});

// new trade added to the DB
exports.addTradeToUser = functions.database.ref('/trades/{draftId}/{tradeId}')
  .onCreate((snapshot, context) => {
    // Only add trades to user when it is first created.

    // grab the new trade data
    const draftId = context.params.draftId;
    const tradeId = context.params.tradeId;
    const trade = snapshot.val();
    const givingTeam = trade.givingTeam;
    const receivingTeam = trade.receivingTeam;

    console.log(`Adding trade ${tradeId} to user ${givingTeam}`);
    console.log(`Adding trade ${tradeId} to user ${receivingTeam}`);

    return Promise.all([
      admin.database().ref(`/tradesUsersPivot/${draftId}/${givingTeam}/${tradeId}`).set(true),
      admin.database().ref(`/tradesUsersPivot/${draftId}/${receivingTeam}/${tradeId}`).set(true),
    ]);
  });

/**
  Accepted Trade
  1. Swap the picks between the two teams
  2. add trade to tradesAccepted table
*/
exports.acceptTrade = functions.database.ref('/trades/{draftId}/{tradeId}')
  .onUpdate((change, context) => {
  // grab the trade status data
    const statusBefore = change.before.child('status').val();
    const statusNow = change.after.child('status').val();

    // trade has been accepted
    if (statusBefore !== statusNow && statusNow === TradeStatus.ACCEPTED) {
      const trade = change.after.val();
      const draftId = context.params.draftId;
      const tradeId = context.params.tradeId;
      const givingTeam = trade.givingTeam;
      const receivingTeam = trade.receivingTeam;
      const givingPicks = trade.givingPicks;
      const receivingPicks = trade.receivingPicks;

      return Promise.all([
        // transfer pick ownership from give -> receieve
        ...map(keys(givingPicks), (pick) => {
          console.log(`Sending pick ${pick} from ${givingTeam} to ${receivingTeam}`);
          admin.database().ref(`drafts/${draftId}/picks/${pick}/team`).set(receivingTeam);
        }),
        // transfer pick ownership from receive -> give
        ...map(keys(receivingPicks), (pick) => {
          console.log(`Sending pick ${pick} from ${receivingTeam} to ${givingTeam}`);
          admin.database().ref(`drafts/${draftId}/picks/${pick}/team`).set(givingTeam);
        }),
      ]).then(() => {
        console.log(`Trade ${tradeId} ACCEPTED, adding to /tradesAccepted`);
        // add entry into accepted trades table
        return admin.database().ref(`/tradesAccepted/${draftId}/${tradeId}`).set(true);
      });
    }

    return false;
  });

/**
  Clear invalid open trade offers
  1. Fetch trade details of accepted trades
  2. Loop through any of these users existing open trades and remove any of them that
    involved any pick that has just been traded.
*/
exports.clearInvalidOffers = functions.database.ref('/tradesAccepted/{draftId}/{tradeId}')
  .onCreate((snap, context) => {
    const draftId = context.params.draftId;
    const tradeId = context.params.tradeId;

    // get the trade details
    return admin.database().ref(`/trades/${draftId}/${tradeId}`).once('value').then((snapshot) => {
      // grab the trade data
      const trade = snapshot.val();
      const givingTeam = trade.givingTeam;
      const receivingTeam = trade.receivingTeam;
      const givingPicks = trade.givingPicks;
      const receivingPicks = trade.receivingPicks;

      // get trades
      return admin.database().ref(`/trades/${draftId}`).once('value').then((snap) => {
        const trades = snap.val();
        const openGivingTrades = [];
        const openReceivingTrades = [];
        // get existing open trade offers for giving and receiving teams
        forEach(trades, (offer) => {
          if (offer.status === TradeStatus.OFFERED) {
            if (offer.givingTeam === givingTeam || offer.receivingTeam === givingTeam) {
              openGivingTrades.push(offer);
            }

            if (offer.givingTeam === receivingTeam || offer.receivingTeam === receivingTeam) {
              openReceivingTrades.push(offer);
            }
          }
        });

        // check if any open offers to/from giving team include any of givingPicks
        return Promise.all([
          ...map(openGivingTrades, (offer) => {
            if (some([
              some(keys(offer.givingPicks), pick => givingPicks[pick]),
              some(keys(offer.receivingPicks), pick => givingPicks[pick]),
            ])) {
              console.log(`Withdrawing trade ${offer.id} on behalf of ${givingTeam}`);
              return admin.database().ref(`trades/${draftId}/${offer.id}`).update({
                status: TradeStatus.WITHDRAWN,
                closedAt: admin.database.ServerValue.TIMESTAMP,
              });
            }

            return null;
          }),
          ...map(openReceivingTrades, (offer) => {
            // check if any open offers to/from receiving team include any of givingPicks
            if (some([
              some(keys(offer.givingPicks), pick => receivingPicks[pick]),
              some(keys(offer.receivingPicks), pick => receivingPicks[pick]),
            ])) {
              console.log(`Withdrawing trade ${offer.id} on behalf of ${receivingTeam}`);
              return admin.database().ref(`trades/${draftId}/${offer.id}`).update({
                status: TradeStatus.WITHDRAWN,
                closedAt: admin.database.ServerValue.TIMESTAMP,
              });
            }

            return null;
          }),
        ]);
      });
    });
  });
