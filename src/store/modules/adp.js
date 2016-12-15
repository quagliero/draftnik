import api from '../../api';
import * as types from '../mutations';

// initial state
const state = {
  all: [],
  timestap: null,
  totalDrafts: 0,
};

// getters
const getters = {
  adp: stateObj => stateObj.all,
  adpTimestap: stateObj => stateObj.timestap,
  adpTotal: stateObj => stateObj.totalDrafts,
};

// actions
const actions = {
  getAdp({ commit }) {
    api.getAdp(data => {
      commit(types.RECEIVE_ADP, { data });
    });
  },
};

// mutations
const mutations = {
  [types.RECEIVE_ADP](stateObj, { data }) {
    stateObj.all = data.adp.player;
    stateObj.timestap = Number(data.adp.timestamp);
    stateObj.totalDrafts = Number(data.adp.totalDrafts);
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
