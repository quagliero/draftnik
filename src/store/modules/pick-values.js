import api from '../../api';
import * as types from '../mutations';

// initial state
const state = {
  bayesian: [],
};

// getters
const getters = {
  bayesianValues: stateObj => stateObj.bayesian,
};

// actions
const actions = {
  getPickValuesBayesian({ commit }) {
    api.getPickValuesBayesian(pickValues => {
      commit(types.RECEIVE_PICK_VALUES_BAYESIAN, { pickValues });
    });
  },
};

// mutations
const mutations = {
  [types.RECEIVE_PICK_VALUES_BAYESIAN](stateObj, { pickValues }) {
    stateObj.bayesian = pickValues;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
