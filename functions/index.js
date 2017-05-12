var functions = require('firebase-functions');
const admin = require('firebase-admin');

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
