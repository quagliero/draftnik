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
    // adps change daily, so in the future compare a timestamp and only update if they differ
    if (!(state.all.length)) {
      api.getAdp().then(response => {
        commit(types.RECEIVE_ADP, { response });
      });
    }
  },
};

// mutations
const mutations = {
  [types.RECEIVE_ADP](stateObj, { response }) {
    stateObj.all = response.data.adp.player;
    stateObj.timestap = Number(response.data.adp.timestamp);
    stateObj.totalDrafts = Number(response.data.adp.totalDrafts);
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
