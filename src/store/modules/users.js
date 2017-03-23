import api from '../../api';
import * as types from '../mutations';

// initial state
const state = {
  all: {},
  currentUser: {},
  watchlist: {},
};

// getters
const getters = {
  allUsers: stateObj => stateObj.all,
  currentUser: stateObj => stateObj.currentUser,
  isAdmin: stateObj => stateObj.currentUser.isAdmin === true,
  watchlist: stateObj => stateObj.watchlist,
};

// actions
const actions = {
  getUsers({ commit }) {
    return new Promise((resolve, reject) => {
      api.getUsers(
        (response) => {
          commit(types.RECEIVE_USERS, response);
          resolve();
        },
        (response) => reject(response),
      );
    });
  },
  getWatchlist({ commit }) {
    api.getWatchlist(state.currentUser.id, (response) => {
      commit(types.RECEIVE_WATCHLIST, response);
    });
  },
  addToWatchlist({ commit }, player) {
    api.addToWatchlist(
      state.currentUser.id,
      player,
      (response) => {
        commit(types.ADDED_TO_WATCHLIST, response);
      },
    );
  },
  removeFromWatchlist({ commit }, player) {
    api.removeFromWatchlist(
      state.currentUser.id,
      player,
      (response) => {
        commit(types.REMOVED_FROM_WATCHLIST, response);
      },
    );
  },
};

// mutations
const mutations = {
  [types.RECEIVE_USERS](stateObj, users) {
    stateObj.all = users;
  },
  [types.CREATE_SESSION](stateObj, { user }) {
    stateObj.currentUser = stateObj.all[user.uid];
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
