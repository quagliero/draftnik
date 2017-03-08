/* eslint-disable */
import api from '../../api';
import * as types from '../mutations';
import { auth } from '../../database';
import router from '../../router';

// initial state
const state = {
  authenticated: null,
  currentUser: {},
  authMessages: [],
};

// getters
const getters = {
  authenticated: stateObj => stateObj.authenticated,
  authMessages: stateObj => stateObj.authMessages,
  currentUser: stateObj => stateObj.currentUser,
};

// actions
const actions = {
  checkAuth({ commit }) {
    auth.onAuthStateChanged((user) => {
      if (user) {
        if (user.uid !== state.currentUser.uid) {
          commit(types.CREATE_SESSION, { user });
          // we've logged in
          if (/login/i.test(window.location.hash)) {
            router.push('me');
          }
        }
      } else {
        // No user is signed in.
        commit(types.DESTROY_SESSION);
        commit(types.CLEAR_AUTH_MESSAGES);
      }
    });
  },
  login({ commit }, credentials) {
    api.login(credentials, (error) => {
      // because it's firebase, we only get notified if error
      // the success is handled by checkAuth which attaches an observer
      // onto onAuthStateChanged method
      commit(types.INVALID_SESSION, error);
    });
  },
  logout({ commit }) {
    api.logout((response) => {
      commit(types.DESTROY_SESSION, response);
      commit(types.CLEAR_AUTH_MESSAGES);
      router.push('/login');
    });
  },
};

// mutations
const mutations = {
  [types.CREATE_SESSION](stateObj, { user }) {
    stateObj.authenticated = true;

    stateObj.currentUser = {
      email: user.email,
      uid: user.uid,
      displayName: user.displayName,
    };
  },
  [types.DESTROY_SESSION](stateObj) {
    stateObj.authenticated = false;
    stateObj.currentUser = {};
  },
  [types.INVALID_SESSION](stateObj, error) {
    stateObj.authenticated = false;
    stateObj.authMessages.push(error);
  },
  [types.CLEAR_AUTH_MESSAGES](stateObj) {
    stateObj.authMessages = [];
  },
  [types.RECEIVE_USERS](stateObj, users) {

  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
