import filter from 'lodash/filter';
import sortBy from 'lodash/sortBy';
import keys from 'lodash/keys';
import toArray from 'lodash/toArray';
import api from '../../api';
import * as types from '../mutations';
import { roundPicksMap, roundPicksTeamMap } from '../../utils';
import { BoardView, PickView } from '../../constants';

// initial state
const state = {
  boardView: BoardView.STACK,
  pickView: PickView.TEAM,
  fetching: false,
  fetched: false,
  all: null,
  currentDraft: {},
  selectedPick: {},
  picksArray: [],
  picksByRound: [],
  picksByRoundByTeam: [],
  currentDraftOrder: [],
};

// getters
const getters = {
  boardView: stateObj => stateObj.boardView,
  pickView: stateObj => stateObj.pickView,
  allDrafts: stateObj => stateObj.all,
  currentDraft: stateObj => stateObj.currentDraft,
  picks: stateObj => stateObj.currentDraft.picks,
  picksArray: stateObj => stateObj.picksArray,
  currentDraftOrder: stateObj => stateObj.currentDraftOrder,
  selectedPick: stateObj => stateObj.selectedPick,
  picksByRound: stateObj => stateObj.picksByRound,
  picksByRoundByTeam: stateObj => stateObj.picksByRoundByTeam,
  picksByTeam: stateObj => (team) => filter(stateObj.currentDraft.picks, (p) => p.team === team),
  getPickById: stateObj => (pickId) => stateObj.currentDraft.picks[pickId],
};

// actions
const actions = {
  getDrafts({ commit }) {
    commit(types.FETCHING_DRAFTS);
    return new Promise((resolve, reject) => {
      // once we have them, don't bother again
      if (state.fetched === true) {
        commit(types.FETCHED_DRAFTS);
        resolve();
      }
      api.once('drafts').then((snapshot) => {
        if (state.fetched === false) {
          commit(types.RECEIVE_DRAFTS, snapshot.val());
          commit(types.MAP_PICKS);
        }
        commit(types.FETCHED_DRAFTS);
        resolve();
      }).catch(err => {
        console.error(err);
        reject();
      });
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
    stateObj.picksArray = toArray(stateObj.currentDraft.picks).sort(
      (a, b) => a.overall - b.overall,
    );
  },
  [types.FETCHING_DRAFTS](stateObj) {
    stateObj.fetched = false;
    stateObj.fetching = true;
  },
  [types.FETCHED_DRAFTS](stateObj) {
    stateObj.fetched = true;
    stateObj.fetching = false;
  },
  [types.SELECT_PICK](stateObj, { pick }) {
    stateObj.selectedPick = pick;
  },
  [types.SELECT_DRAFT](stateObj, { draftId }) {
    stateObj.currentDraft = draftId;
  },
  [types.MAP_PICKS](stateObj) {
    stateObj.picksByRound = roundPicksMap(stateObj.picksArray);
    stateObj.picksByRoundByTeam = roundPicksTeamMap(
      stateObj.picksByRound,
      stateObj.currentDraftOrder,
    );
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
