import api from '../../api';
import * as types from '../mutations';

// initial state
const state = {
  all: [],
  timestap: null,
};

// getters
const getters = {
  players: stateObj => stateObj.all,
};

// actions
const actions = {
  getPlayers({ commit }) {
    // players are static (right now, anyway) so do not waste time and resource
    // fetching them over and over and over and over
    if (!(state.all.length)) {
      api.getPlayers(response => {
        commit(types.RECEIVE_PLAYERS, { response });
      });
    }
  },
};

// mutations
const mutations = {
  [types.RECEIVE_PLAYERS](stateObj, { response }) {
    const allowedPos = /^(QB|RB|WR|TE|PK|Def)$/;
    stateObj.all = response.data.players.player.filter(p => allowedPos.test(p.position))
    .sort((a, b) => a.id - b.id);
    stateObj.timestap = Number(response.data.players.timestamp);
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
