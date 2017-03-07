import * as types from '../mutations';

// initial state
const state = {
  all: [],
  givingTeam: null,
  selectedTeam: null,
  receivingTeam: null,
};

// getters
const getters = {
  teams: stateObj => stateObj.all,
  selectedTeam: stateObj => stateObj.selectedTeam,
  receivingTeam: stateObj => stateObj.receivingTeam,
  givingTeam: stateObj => stateObj.givingTeam,
};

// actions
const actions = {
};

// mutations
const mutations = {
  [types.CREATE_SESSION](stateObj, { user }) {
    stateObj.givingTeam = user.uid;
  },
  [types.RECEIVE_DRAFTS](stateObj, response) {
    stateObj.all = response[Object.keys(response)[0]].teams;
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
