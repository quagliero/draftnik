import api from '../../api';
import * as types from '../mutations';

// initial state
const state = {
  all: [],
};

// getters
const getters = {
  allTeams: stateObj => stateObj.all,
};

// actions
const actions = {
  getAllTeams({ commit }) {
    api.getTeams(response => {
      commit(types.RECEIVE_TEAMS, { response });
    });
  },
};

// mutations
const mutations = {
  [types.RECEIVE_TEAMS](stateObj, { response }) {
    stateObj.all = response.data;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
