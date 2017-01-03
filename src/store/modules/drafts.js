import api from '../../api';
import * as types from '../mutations';

// initial state
const state = {
  all: [],
  selectedTeam: null,
};

// getters
const getters = {
  allDrafts: stateObj => stateObj.all,
  currentDraft: stateObj => stateObj.all[stateObj.all.length - 1],
  selectedTeam: stateObj => stateObj.selectedTeam,
};

// actions
const actions = {
  getAllDrafts({ commit }) {
    // once we have them, don't bother again
    if (!(state.all.length)) {
      api.getDrafts(drafts => {
        commit(types.RECEIVE_DRAFTS, { drafts });
      });
    }
  },
};

// mutations
const mutations = {
  [types.RECEIVE_DRAFTS](stateObj, { drafts }) {
    stateObj.all = drafts;
  },
  [types.SELECT_TEAM](stateObj, { teamId }) {
    stateObj.selectedTeam = teamId;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
