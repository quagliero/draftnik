const map = require('lodash.map');
const keys = require('lodash.keys');
const admin = require('firebase-admin');

var functions = require('firebase-functions');

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

    return Promise.all([
      admin.database().ref(`/tradesUsersPivot/${draftId}/${givingTeam}/${tradeId}`).set(true),
      admin.database().ref(`/tradesUsersPivot/${draftId}/${receivingTeam}/${tradeId}`).set(true),
    ]);
  });

// add accepted trade to accepted trades
exports.handleAcceptedTrade = functions.database.ref('/trades/{draftId}/{tradeId}')
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

      return Promise.all([
        // add entry into accepted trades table
        admin.database().ref(`/tradesAccepted/${draftId}/${tradeId}`).set(true),
        // transfer pick ownership
        ...map(keys(givingPicks), (pick) => admin.database().ref(`drafts/${draftId}/picks/${pick}/team`).set(receivingTeam)),
        ...map(keys(receivingPicks), (pick) => admin.database().ref(`drafts/${draftId}/picks/${pick}/team`).set(givingTeam)),
      ]);
    } else {
      return;
    }
  });

  // @TODO tidy up invalid trades

/**
Promise.all([
  api.set(`tradesAccepted/${draft}/${trade}`, true),
  ...map(keys(givingPicks), (pick) => api.set(`drafts/${draft}/picks/${pick}/team`, receivingTeam)),
  ...map(keys(receivingPicks), (pick) => api.set(`drafts/${draft}/picks/${pick}/team`, givingTeam)),
]).then(() => {

// tidy up any potential conflicting open offers
const openOffers = filter(state.userTrades, (userTrade) => {
  if (userTrade.id !== trade && userTrade.status === TradeStatus.OFFERED) {
    return true;
  }
  return false;
});

Promise.all([
  ...map(openOffers, (offer) => {
    if (some([
      some(keys(offer.givingPicks), pick => givingPicks[pick]),
      some(keys(offer.receivingPicks), pick => givingPicks[pick]),
      some(keys(offer.givingPicks), pick => receivingPicks[pick]),
      some(keys(offer.receivingPicks), pick => receivingPicks[pick]),
    ])) {
      return api.update(`trades/${draft}/${offer.id}`, {
        status: TradeStatus.WITHDRAWN,
        closedAt: fireDb.ServerValue.TIMESTAMP,
      });
    }

    return null;
  }),
]);
**/
