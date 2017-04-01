import filter from 'lodash/filter';
import toArray from 'lodash/toArray';
import api from '../../api';
import * as types from '../mutations';
import { roundPicksMap } from '../../utils';

// initial state
const state = {
  all: null,
  currentDraft: {},
  selectedPick: {},
  picksByRound: {},
  order: {},
};

// getters
const getters = {
  allDrafts: stateObj => stateObj.all,
  currentDraft: stateObj => stateObj.currentDraft,
  picks: stateObj => stateObj.currentDraft.picks,
  picksArray: stateObj => toArray(stateObj.currentDraft.picks).sort(
    (a, b) => a.overall - b.overall,
  ),
  draftOrder: stateObj => stateObj.order,
  selectedPick: stateObj => stateObj.selectedPick,
  picksByRound: stateObj => stateObj.picksByRound,
  picksByTeam: stateObj => (team) => filter(stateObj.currentDraft.picks, (p) => p.team === team),
};

// actions
const actions = {
  getDrafts({ commit }) {
    // once we have them, don't bother again
    return new Promise((resolve, reject) => {
      if (state.all === null) {
        api.getDrafts().then(snapshot => {
          commit(types.RECEIVE_DRAFTS, snapshot.val());
          commit(types.MAP_PICKS);
          resolve();
        }).catch(err => {
          console.log(err);
          reject();
        });
      } else {
        resolve();
      }
    });
  },
};

// mutations
const mutations = {
  [types.RECEIVE_DRAFTS](stateObj, response) {
    stateObj.all = response;
    stateObj.currentDraft = response[Object.keys(response)[0]];
    stateObj.order = stateObj.currentDraft.order.filter(a => a);
  },
  [types.SELECT_PICK](stateObj, { pick }) {
    stateObj.selectedPick = pick;
  },
  [types.SELECT_DRAFT](stateObj, { draftId }) {
    stateObj.currentDraft = draftId;
  },
  [types.MAP_PICKS](stateObj) {
    stateObj.picksByRound = roundPicksMap(
      stateObj.currentDraft.picks,
    );
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
