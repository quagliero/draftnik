import api from '../../api';
import * as types from '../mutations';

// initial state
const state = {
  watchlist: {},
  watchlistReceived: false,
};

// getters
const getters = {
  watchlist: stateObj => stateObj.watchlist,
  watchlistReceived: stateObj => stateObj.watchlistReceived,
};

// actions
const actions = {
  getWatchlist({ commit }, { draft, user }) {
    if (state.watchlistReceived === false) {
      if (draft && user) {
        api.listenForValueEvents(`watchlists/${draft}/${user}`, (watchlist) => {
          commit(types.RECEIVE_WATCHLIST, watchlist);
        });
      }
    }
  },
  addToWatchlist({ commit }, { draft, user, player }) {
    api.set(`watchlists/${draft}/${user}/${player.id}`, true).then(() => {
      commit(types.ADDED_TO_WATCHLIST, player);
    }).catch(error => {
      console.error(error);
    });
  },
  removeFromWatchlist({ commit }, { draft, user, player }) {
    api.remove(`watchlists/${draft}/${user}/${player.id}`).then(() => {
      commit(types.REMOVED_FROM_WATCHLIST, player);
    }).catch(error => {
      console.error(error);
    });
  },
};

// mutations
const mutations = {
  [types.DESTROY_SESSION](stateObj) {
    stateObj.watchlist = {};
    stateObj.watchlistReceived = false;
  },
  [types.INVALID_SESSION](stateObj) {
    stateObj.watchlist = {};
    stateObj.watchlistReceived = false;
  },
  [types.RECEIVE_WATCHLIST](stateObj, watchlist) {
    stateObj.watchlist = watchlist || {};
    stateObj.watchlistReceived = true;
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
