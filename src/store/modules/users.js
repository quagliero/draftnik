import api from '../../api';
import * as types from '../mutations';

// initial state
const state = {
  all: {},
};

// getters
const getters = {
  allUsers: stateObj => stateObj.all,
};

// actions
const actions = {
  getUsers({ commit }) {
    api.getUsers(response => {
      commit(types.RECEIVE_USERS, response);
    });
  },
};

// mutations
const mutations = {
  [types.RECEIVE_USERS](stateObj, users) {
    stateObj.all = users;
  },
  [types.DESTROY_SESSION](stateObj) {
    stateObj.currentUser = null;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
