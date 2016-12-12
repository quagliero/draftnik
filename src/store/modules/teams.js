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
    api.getTeams(teams => {
      commit(types.RECEIVE_TEAMS, { teams });
    });
  },
};

// mutations
const mutations = {
  [types.RECEIVE_TEAMS](stateObj, { teams }) {
    stateObj.all = teams;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
