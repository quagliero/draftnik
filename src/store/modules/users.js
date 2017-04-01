import get from 'lodash/get';
import api from '../../api';
import * as types from '../mutations';
import { getUserById } from '../../utils';

// initial state
const state = {
  all: null,
  currentUser: null,
};

// getters
const getters = {
  allUsers: stateObj => stateObj.all,
  currentUser: stateObj => getUserById(stateObj.currentUser),
  isAdmin: stateObj => get(getUserById(stateObj.currentUser), 'isAdmin', false),
};

// actions
const actions = {
  getUsers({ commit }) {
    return new Promise((resolve, reject) => {
      if (state.all === null) {
        api.getUsers()
        .then(snapshot => {
          commit(types.RECEIVE_USERS, snapshot.val());
          resolve();
        })
        .catch(error => {
          console.log(error);
          reject();
        });
      } else {
        resolve();
      }
    });
  },
};

// mutations
const mutations = {
  [types.RECEIVE_USERS](stateObj, users) {
    stateObj.all = users;
  },
  [types.CREATE_SESSION](stateObj, { user }) {
    stateObj.currentUser = user.uid;
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
  // [types.ADDED_TO_WATCHLIST](stateObj, player) {
  //   console.log(player);
  // },
  // [types.REMOVED_FROM_WATCHLIST](stateObj, player) {
  //   console.log(player);
  // },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
