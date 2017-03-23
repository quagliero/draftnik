import * as types from '../mutations';

// initial state
const state = {
  all: [],
  selectedTeam: null,
};

// getters
const getters = {
  teams: stateObj => stateObj.all,
  selectedTeam: stateObj => stateObj.selectedTeam,
};

// actions
const actions = {
};

// mutations
const mutations = {
  [types.CREATE_SESSION](stateObj, { user }) {
    stateObj.selectedTeam = user.uid;
  },
  [types.RECEIVE_DRAFTS](stateObj, response) {
    stateObj.all = response[Object.keys(response)[0]].teams;
  },
  [types.SELECT_TEAM](stateObj, { teamId }) {
    // unset if same team given again
    stateObj.selectedTeam = (teamId !== stateObj.selectedTeam) ? teamId : null;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
