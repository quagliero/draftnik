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
  getPlayersAndAdp({ commit }) {
    const cloudFunctionUrl = `${process.env.FIREBASE_CLOUD_FUNCTIONS}/fetchPlayerData`;

    api.get(cloudFunctionUrl).then((response) => {
      const playerAdpData = response.data;
      commit(types.RECEIVE_PLAYERS, { players: playerAdpData.player });
      commit(types.RECEIVE_ADP, { adp: playerAdpData });
    });
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
