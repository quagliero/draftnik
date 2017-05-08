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
    if (state.all === null) {
      api.get('/static/data/adp-player.json').then((response) => {
        const data = response.data;
        commit(types.RECEIVE_PLAYERS, { players: data.adp_data.player });
        commit(types.RECEIVE_ADP, { adp: data });
      }).catch(error => {
        console.error(error);
      });
    }
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
