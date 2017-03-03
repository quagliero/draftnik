import api from '../../api';
import * as types from '../mutations';

// initial state
const state = {
  all: [],
  selectedTeam: null,
  receivingTeam: null,
};

// getters
const getters = {
  teams: stateObj => stateObj.all,
  selectedTeam: stateObj => stateObj.selectedTeam,
  receivingTeam: stateObj => stateObj.receivingTeam,
};

// actions
const actions = {
  getAllTeams({ commit }) {
    api.getTeams(response => {
      commit(types.RECEIVE_TEAMS, { response });
    });
  },
};

// mutations
const mutations = {
  [types.RECEIVE_DRAFTS](stateObj, { response }) {
    stateObj.all = response.data.drafts[response.data.drafts.length - 1].users;
  },
  [types.SELECT_TEAM](stateObj, { teamId }) {
    // unset if same team given again
    stateObj.selectedTeam = (teamId !== stateObj.selectedTeam) ? teamId : null;
  },
  [types.SELECT_RECEIVING_TEAM](stateObj, teamId) {
    stateObj.receivingTeam = teamId;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
