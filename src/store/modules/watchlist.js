import api from '../../api';
import * as types from '../mutations';

// initial state
const state = {
  watchlist: null,
};

// getters
const getters = {
  watchlist: stateObj => stateObj.watchlist,
};

// actions
const actions = {
  getWatchlist({ commit }, data) {
    api.getWatchlist(data.draft, data.user, (watchlist) => {
      commit(types.RECEIVE_WATCHLIST, watchlist);
    });
  },
  addToWatchlist({ commit }, data) {
    api.addToWatchlist(data.draft, data.user, data.player).then(() => {
      commit(types.ADDED_TO_WATCHLIST, data.player);
    }).catch(error => {
      console.error(error);
    });
  },
  removeFromWatchlist({ commit }, data) {
    api.removeFromWatchlist(data.draft, data.user, data.player).then(() => {
      commit(types.REMOVED_FROM_WATCHLIST, data.player);
    }).catch(error => {
      console.error(error);
    });
  },
};

// mutations
const mutations = {
  [types.DESTROY_SESSION](stateObj) {
    stateObj.watchlist = null;
  },
  [types.INVALID_SESSION](stateObj) {
    stateObj.watchlist = null;
  },
  [types.RECEIVE_WATCHLIST](stateObj, watchlist) {
    stateObj.watchlist = watchlist;
  },
  [types.ADDED_TO_WATCHLIST](stateObj, player) {
    console.log(player);
  },
  [types.REMOVED_FROM_WATCHLIST](stateObj, player) {
    console.log(player);
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
