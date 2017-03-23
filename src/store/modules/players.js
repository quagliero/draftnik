import reduce from 'lodash/reduce';
import api from '../../api';
import * as types from '../mutations';

// initial state
const state = {
  all: {},
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
    stateObj.all = reduce(response.data.players.player, (acc, cur) => {
      acc[cur.id] = cur;
      return acc;
    }, {});
    stateObj.timestap = Number(response.data.players.timestamp);
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
