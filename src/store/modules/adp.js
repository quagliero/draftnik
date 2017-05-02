import * as types from '../mutations';

// initial state
const state = {
  all: [],
  totalDrafts: 0,
  dateStart: null,
  dateEnd: null,
};

// getters
const getters = {
  adp: stateObj => stateObj.all,
  adpTimestap: stateObj => stateObj.timestap,
  adpTotal: stateObj => stateObj.totalDrafts,
  adpStart: stateObj => stateObj.dateStart,
  adpEnd: stateObj => stateObj.dateEnd,
};

// actions


// mutations
const mutations = {
  [types.RECEIVE_ADP](stateObj, { adp }) {
    stateObj.all = adp.adp_data.player;
    stateObj.totalDrafts = Number(adp.adp_info.total_drafts);
    stateObj.dateStart = adp.adp_info.start_date;
    stateObj.dateEnd = adp.adp_info.end_date;
  },
};

export default {
  state,
  getters,
  mutations,
};
