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
    api.getPlayers(data => {
      commit(types.RECEIVE_PLAYERS, { data });
    });
  },
};

// mutations
const mutations = {
  [types.RECEIVE_PLAYERS](stateObj, { data }) {
    const allowedPos = /^(QB|RB|WR|TE|PK|Def)$/;
    stateObj.all = data.players.player.filter(p => allowedPos.test(p.position));
    stateObj.timestap = Number(data.players.timestamp);
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
