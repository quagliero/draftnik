import * as types from '../mutations';

// initial state
const state = {
  all: [],
  totalDrafts: 0,
};

// getters
const getters = {
  adp: stateObj => stateObj.all,
  adpTimestap: stateObj => stateObj.timestap,
  adpTotal: stateObj => stateObj.totalDrafts,
};

// actions


// mutations
const mutations = {
  [types.RECEIVE_ADP](stateObj, { adp }) {
    stateObj.all = adp.adp_data.player;
    stateObj.totalDrafts = Number(adp.adp_info.total_drafts);
  },
};

export default {
  state,
  getters,
  mutations,
};
