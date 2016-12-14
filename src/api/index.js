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
};
