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
    // pick values are static snapshot of 3rd party data so do not waste time and resource
    // fetching them over and over and over and over
    if (!(state.bayesian.length)) {
      api.getPickValuesBayesian(pickValues => {
        commit(types.RECEIVE_PICK_VALUES_BAYESIAN, { pickValues });
      });
    }
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
