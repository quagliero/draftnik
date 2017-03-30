import get from 'lodash/get';
import api from '../../api';
import drafts from './drafts';
import * as types from '../mutations';

// initial state
const state = {
  all: {},
  currentUser: null,
  watchlist: {},
  trades: {},
};

// getters
const getters = {
  allUsers: stateObj => stateObj.all,
  currentUser: stateObj => stateObj.currentUser,
  isAdmin: stateObj => get(stateObj.currentUser, 'isAdmin', false),
  watchlist: stateObj => stateObj.watchlist,
  trades: stateObj => stateObj.trades,
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
    api.getWatchlist(
      drafts.state.currentDraft.id,
      state.currentUser.id,
      (response) => {
        commit(types.RECEIVE_WATCHLIST, response);
      },
    );
  },
  getUserTrades({ commit }) {
    api.getUserTrades(
      drafts.state.currentDraft.id,
      state.currentUser.id,
      (response) => {
        commit(types.RECEIVE_USER_TRADES, response);
      },
    );
  },
  addToWatchlist({ commit }, player) {
    api.addToWatchlist(
      drafts.state.currentDraft.id,
      state.currentUser.id,
      player,
      (response) => {
        commit(types.ADDED_TO_WATCHLIST, response);
      },
    );
  },
  removeFromWatchlist({ commit }, player) {
    api.removeFromWatchlist(
      drafts.state.currentDraft.id,
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
  [types.DESTROY_SESSION](stateObj) {
    stateObj.currentUser = null;
    stateObj.watchlist = {};
  },
  [types.INVALID_SESSION](stateObj) {
    stateObj.currentUser = null;
    stateObj.watchlist = {};
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
