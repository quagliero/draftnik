import api from '../../api';
import * as types from '../mutations';
import roundPicksMap from '../../utils/utils';

// initial state
const state = {
  all: [],
  selectedTeam: null,
  selectedDraft: null,
  picksByRound: {},
};

// getters
const getters = {
  allDrafts: stateObj => stateObj.all,
  selectedDraft: stateObj => stateObj.selectedDraft,
  selectedTeam: stateObj => stateObj.selectedTeam,
  picksByRound: stateObj => stateObj.picksByRound,
};

// actions
const actions = {
  getAllDrafts({ commit }) {
    // once we have them, don't bother again
    if (!(state.all.length)) {
      api.getDrafts(response => {
        commit(types.RECEIVE_DRAFTS, { response });
        commit(types.MAP_PICKS);
      });
    }
  },
};

// mutations
const mutations = {
  [types.RECEIVE_DRAFTS](stateObj, { response }) {
    stateObj.all = response.data.drafts;
    stateObj.selectedDraft = response.data.drafts[response.data.drafts.length - 1];
  },
  [types.SELECT_TEAM](stateObj, { teamId }) {
    stateObj.selectedTeam = teamId;
  },
  [types.SELECT_DRAFT](stateObj, { draftId }) {
    stateObj.selectedDraft = draftId;
  },
  [types.MAP_PICKS](stateObj) {
    stateObj.picksByRound = roundPicksMap(
      stateObj.selectedDraft.rounds,
      stateObj.selectedDraft.picks,
    );
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
