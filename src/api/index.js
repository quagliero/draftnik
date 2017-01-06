import axios from 'axios';

export default {
  getTeams(cb) {
    axios.get(`${process.env.API_URL}/users`)
    .then(response => cb(response));
  },
  getDrafts(cb) {
    axios.get(`${process.env.API_URL}/drafts`)
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
