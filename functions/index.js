/* eslint-disable no-console */
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

admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// new trade added to the DB
exports.addTradeToUser = functions.database.ref('/trades/{draftId}/{tradeId}')
  .onWrite((event) => {
  // grab the new trade data
    const draftId = event.params.draftId;
    const tradeId = event.params.tradeId;
    const trade = event.data.val();
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
  1. add trade to tradesAccepted table
  2. Swap the picks between the two teams
  3. Loop through any of these users existing open trades and remove any of them that
    involved any pick that has just been traded.
*/
exports.acceptTrade = functions.database.ref('/trades/{draftId}/{tradeId}')
  .onWrite((event) => {
  // grab the trade status data
    const eventSnapshot = event.data;
    const statusSnapshot = eventSnapshot.child('status');

    // trade has been accepted
    if (statusSnapshot.changed() && statusSnapshot.val() === TradeStatus.ACCEPTED) {
      const trade = event.data.val();
      const draftId = event.params.draftId;
      const tradeId = event.params.tradeId;
      const givingTeam = trade.givingTeam;
      const receivingTeam = trade.receivingTeam;
      const givingPicks = trade.givingPicks;
      const receivingPicks = trade.receivingPicks;

      console.log(`Trade ${tradeId} ACCEPTED, adding to /tradesAccepted`);

      return Promise.all([
        // add entry into accepted trades table
        admin.database().ref(`/tradesAccepted/${draftId}/${tradeId}`).set(true),
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
      ]).then(() => Promise.all([
        // get trades
        admin.database().ref(`/trades/${draftId}`).once('value').then((snapshot) => {
          const trades = snapshot.val();
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
        }),
      ]));
    }

    return false;
  });
