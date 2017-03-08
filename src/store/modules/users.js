import api from '../../api';
import * as types from '../mutations';

// initial state
const state = {
  all: {},
  currentUser: {},
};

// getters
const getters = {
  allUsers: stateObj => stateObj.all,
  currentUser: stateObj => stateObj.currentUser,
  isAdmin: stateObj => stateObj.currentUser.isAdmin === true,
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
};

// mutations
const mutations = {
  [types.RECEIVE_USERS](stateObj, users) {
    stateObj.all = users;
  },
  [types.CREATE_SESSION](stateObj, { user }) {
    stateObj.currentUser = stateObj.all[user.uid];
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
