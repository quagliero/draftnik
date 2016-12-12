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
};
