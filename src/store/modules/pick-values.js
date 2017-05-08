import api from '../../api';
import * as types from '../mutations';

// initial state
const state = {
  bayesian: [],
  bayesianMaxValue: null,
};

// getters
const getters = {
  bayesianValues: stateObj => stateObj.bayesian,
  bayesianMaxValue: stateObj => stateObj.bayesianMaxValue,
};

// actions
const actions = {
  getPickValuesBayesian({ commit }) {
    // pick values are static snapshot of 3rd party data so do not waste time and resource
    // fetching them over and over and over and over
    if (!(state.bayesian.length)) {
      api.get('/static/data/pick-values-bayesian.json').then((response) => {
        commit(types.RECEIVE_PICK_VALUES_BAYESIAN, { response });
      }).catch(error => {
        console.error(error);
      });
    }
  },
};

// mutations
const mutations = {
  [types.RECEIVE_PICK_VALUES_BAYESIAN](stateObj, { response }) {
    stateObj.bayesian = response.data;
    stateObj.bayesianMaxValue = response.data[0].value;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
