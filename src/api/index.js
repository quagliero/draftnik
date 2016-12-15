/**
 * Mocking client-server processing
 */

export default {
  getTeams(cb) {
    window.fetch('//draftnik.app/api/users')
    .then(response => response.json())
    .then(response => cb(response));
  },
  getDrafts(cb) {
    window.fetch('//draftnik.app/api/drafts')
    .then(response => response.json())
    .then(response => cb(response));
  },
  getPickValuesBayesian(cb) {
    window.fetch('/static/data/pick-values-bayesian.json')
    .then(response => response.json())
    .then(response => cb(response));
  },
  getPlayers(cb) {
    window.fetch('/static/data/players.json')
    .then(response => response.json())
    .then(response => cb(response));
  },
  getAdp(cb) {
    window.fetch('/static/data/adp.json')
    .then(response => response.json())
    .then(response => cb(response));
  },
};
