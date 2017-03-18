import api from '../../api';
import * as types from '../mutations';
import { roundPicksMap } from '../../utils';

// initial state
const state = {
  all: [],
  selectedDraft: {},
  selectedPick: {},
  picksByRound: {},
  order: {},
};

// getters
const getters = {
  allDrafts: stateObj => stateObj.all,
  selectedDraft: stateObj => stateObj.selectedDraft,
  picks: stateObj => stateObj.selectedDraft.picks,
  draftOrder: stateObj => stateObj.order,
  selectedPick: stateObj => stateObj.selectedPick,
  picksByRound: stateObj => stateObj.picksByRound,
};

// actions
const actions = {
  getDrafts({ commit }) {
    // once we have them, don't bother again
    if (!(state.all.length)) {
      api.getDrafts((response) => {
        commit(types.RECEIVE_DRAFTS, response);
        commit(types.MAP_PICKS);
      });
    }
  },
};

// mutations
const mutations = {
  [types.RECEIVE_DRAFTS](stateObj, response) {
    stateObj.all = response;
    stateObj.selectedDraft = response[Object.keys(response)[0]];
    stateObj.order = stateObj.selectedDraft.order.filter(a => a);
  },
  [types.SELECT_PICK](stateObj, { pick }) {
    stateObj.selectedPick = pick;
  },
  [types.SELECT_DRAFT](stateObj, { draftId }) {
    stateObj.selectedDraft = draftId;
  },
  [types.MAP_PICKS](stateObj) {
    stateObj.picksByRound = roundPicksMap(
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
