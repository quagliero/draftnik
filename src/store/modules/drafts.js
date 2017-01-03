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
      api.getDrafts(drafts => {
        commit(types.RECEIVE_DRAFTS, { drafts });
        commit(types.MAP_PICKS);
      });
    }
  },
};

// mutations
const mutations = {
  [types.RECEIVE_DRAFTS](stateObj, { drafts }) {
    stateObj.all = drafts;
    stateObj.selectedDraft = drafts[drafts.length - 1];
  },
  [types.SELECT_TEAM](stateObj, { teamId }) {
    stateObj.selectedTeam = teamId;
  },
  [types.SELECT_DRAFT](stateObj, { draftId }) {
    stateObj.selectedDraft = draftId;
  },
  [types.MAP_PICKS](stateObj) {
    stateObj.picksByRound = roundPicksMap(stateObj.selectedDraft.rounds,
    stateObj.selectedDraft.picks);
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
