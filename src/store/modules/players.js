import reduce from 'lodash/reduce';
import * as types from '../mutations';
import playerAdpData from '../../../static/data/adp-player.json';

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
  getPlayersAndAdp({ commit }) {
    commit(types.RECEIVE_PLAYERS, { players: playerAdpData.player });
    commit(types.RECEIVE_ADP, { adp: playerAdpData });
  },
};

// mutations
const mutations = {
  [types.RECEIVE_PLAYERS](stateObj, { players }) {
    stateObj.all = reduce(players, (acc, cur) => {
      acc[cur.id] = cur;
      return acc;
    }, {});
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
