require('shelljs/global');
const axios = require('axios');
const parser = require('xml2json');
const ora = require('ora');
const path = require('path')

const staticDir = path.resolve(__dirname, '../static/data');
const spinner = ora('fetching player/adp data from Fantasy Football Calculator...');

const url = 'https://fantasyfootballcalculator.com/adp_xml.php?format=standard&teams=12';

spinner.start();

axios.get(url)
  .then(response => {
    const data = parser.toJson(response.data, { object: true });
    if (!(data)) {
      spinner.stop();
      console.error('No player or adp data found in response objects');
    }

    spinner.text = 'data fetched, processing...';

    JSON.stringify(data.root).to(`${staticDir}/adp-player.json`);

    spinner.text = 'ADP and player JSON files created';
    spinner.succeed();
  })
  .catch((err) => {
    spinner.stop();
    throw err;
  });
