require('shelljs/global');
const axios = require('axios');
const ora = require('ora');
const path = require('path')

const staticDir = path.resolve(__dirname, '../static/data');
const spinner = ora('fetching player/adp data from MFL...');
const mflUrl = 'http://www03.myfantasyleague.com/2017/export?JSON=1&TYPE=';

spinner.start();

function getPlayerData() {
  return axios.get(`${mflUrl}players`);
}

function getAdpData() {
  return axios.get(`${mflUrl}adp&FRANCHISES=12&IS_PPR=0&IS_KEEPER=0`);
}

axios.all([getPlayerData(), getAdpData()])
  .then(axios.spread((playerResponse, adpResponse) => {
    if (!(playerResponse.data.player || adpResponse.data.adp)) {
      spinner.stop();
      console.error('No player or adp data found in response objects');
    }

    spinner.text = 'data fetched, processing...';

    let playerData = playerResponse.data;
    let adpData = adpResponse.data;

    const playerArray = [];
    const adpArray = [];

    // flat array containing just the player IDs found in the ADP data
    const adpPlayerIds = adpData.adp.player.map((adp) => adp.id);
    // which positions do we care about
    const allowedPos = /^(QB|RB|WR|TE|PK|Def)$/;
    // filter out all players that don't match the wanted positions
    const allowedPlayerList = playerData.players.player.filter((p) => allowedPos.test(p.position));
    // filter out all players not in the ADP data
    const playersBeingDrafted = allowedPlayerList.filter((p) => adpPlayerIds.indexOf(p.id) > -1);
    // create player and adp Arrays containing only data of player/adp in use
    const playersWithAdp = playersBeingDrafted.forEach(player => {
      const adp = adpData.adp.player.find((adp) => adp.id === player.id);
      playerArray.push(Object.assign({}, player, { adp }));
      adpArray.push(Object.assign({}, adp));
    });

    // overwrite enormous player response with only players we want
    playerData.players.player = playerArray;

    // overwrite adp data with player info within it to save constant lookups
    adpData.adp.player = adpArray.sort((a, b) => Number(a.averagePick) - Number(b.averagePick));

    spinner.text = 'data processed, rewriting files...';

    JSON.stringify(adpData).to(`${staticDir}/adp.json`);
    JSON.stringify(playerData).to(`${staticDir}/players.json`);

    spinner.text = 'ADP and player JSON files created';
    spinner.succeed();
  }))
  .catch((err) => {
    spinner.stop();
    throw err;
  });
