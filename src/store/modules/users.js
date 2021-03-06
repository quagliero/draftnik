import { set } from 'vue';
import get from 'lodash/get';
import api from '../../api';
import * as types from '../mutations';
import { getUserById } from '../../utils';

// initial state
const state = {
  received: false,
  all: null,
  currentUser: null,
  prefs: {
    showPicks: true,
    showWatchlist: true,
    showTrades: true,
  },
};

// getters
const getters = {
  allUsers: stateObj => stateObj.all,
  currentUser: stateObj => getUserById(stateObj.currentUser),
  isAdmin: stateObj => get(getUserById(stateObj.currentUser), 'isAdmin', false),
  getUserById: stateObj => id => stateObj.all[id],
  userPrefs: stateObj => stateObj.prefs,
};

// actions
const actions = {
  getUsers({ commit }) {
    return new Promise((resolve, reject) => {
      if (state.received === false) {
        api.once('users').then(snapshot => {
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
    stateObj.received = true;
    stateObj.all = users;
  },
  [types.CREATE_SESSION](stateObj, { user }) {
    stateObj.currentUser = user.uid;
  },
  [types.DESTROY_SESSION](stateObj) {
    stateObj.currentUser = null;
  },
  [types.INVALID_SESSION](stateObj) {
    stateObj.currentUser = null;
  },
  [types.CHANGE_USER_PREF](stateObj, { pref, value }) {
    set(stateObj.prefs, pref, value);
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
