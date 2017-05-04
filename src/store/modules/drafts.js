import filter from 'lodash/filter';
import sortBy from 'lodash/sortBy';
import keys from 'lodash/keys';
import toArray from 'lodash/toArray';
import api from '../../api';
import * as types from '../mutations';
import { roundPicksMap } from '../../utils';
import { BoardView, PickView } from '../../constants';

// initial state
const state = {
  boardView: BoardView.SNAKE,
  pickView: PickView.TEAM,
  fetching: false,
  all: null,
  currentDraft: {},
  selectedPick: {},
  picksByRound: {},
  currentDraftOrder: {},
};

// getters
const getters = {
  boardView: stateObj => stateObj.boardView,
  pickView: stateObj => stateObj.pickView,
  allDrafts: stateObj => stateObj.all,
  currentDraft: stateObj => stateObj.currentDraft,
  picks: stateObj => stateObj.currentDraft.picks,
  picksArray: stateObj => toArray(stateObj.currentDraft.picks).sort(
    (a, b) => a.overall - b.overall,
  ),
  currentDraftOrder: stateObj => stateObj.currentDraftOrder,
  selectedPick: stateObj => stateObj.selectedPick,
  picksByRound: stateObj => stateObj.picksByRound,
  picksByTeam: stateObj => (team) => filter(stateObj.currentDraft.picks, (p) => p.team === team),
  getPickById: stateObj => (pickId) => stateObj.currentDraft.picks[pickId],
};

// actions
const actions = {
  getDrafts({ commit }) {
    // once we have them, don't bother again
    return new Promise((resolve, reject) => {
      if (state.all === null && state.fetching === false) {
        commit(types.FETCHING_DRAFTS);
        api.getDrafts().then(snapshot => {
          commit(types.FETCHED_DRAFTS);
          commit(types.RECEIVE_DRAFTS, snapshot.val());
          commit(types.MAP_PICKS);
          resolve();
        }).catch(err => {
          console.error(err);
          commit(types.FETCHED_DRAFTS);
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
  [types.SELECT_BOARD_VIEW](stateObj, view) {
    stateObj.boardView = view;
  },
  [types.SELECT_PICK_VIEW](stateObj, view) {
    stateObj.pickView = view;
  },
  [types.RECEIVE_DRAFTS](stateObj, response) {
    stateObj.all = response;
    stateObj.currentDraft = response[keys(response)[0]];
    stateObj.currentDraftOrder = sortBy(
      keys(stateObj.currentDraft.order), (team) => stateObj.currentDraft.order[team],
    );
  },
  [types.FETCHING_DRAFTS](stateObj) {
    stateObj.fetching = true;
  },
  [types.FETCHED_DRAFTS](stateObj) {
    stateObj.fetching = false;
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
