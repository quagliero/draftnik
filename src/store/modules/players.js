import reduce from 'lodash/reduce';
import api from '../../api';
import * as types from '../mutations';

// initial state
const state = {
  all: null,
  timestap: null,
};

// getters
const getters = {
  players: stateObj => stateObj.all,
};

// actions
const actions = {
  getPlayers({ commit }) {
    if (state.all == null) {
      api.getPlayers().then(response => {
        commit(types.RECEIVE_PLAYERS, { response });
      }).catch(error => {
        console.error(error);
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
