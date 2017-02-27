import * as types from '../mutations';

// eslint-disable-next-line
const Trade = (tradeProps) => {
  return {
    id: tradeProps.id,
    teamA: tradeProps.teamA,
    teamB: tradeProps.teamB,
    teamAPicks: tradeProps.teamAPicks || [],
    teamBPicks: tradeProps.teamBPicks || [],
  };
};

const defaultState = {
  temp: {},
  current: {},
  savedTrades: [],
};

// initial state
const state = Object.assign({}, defaultState);

// getters
const getters = {
  tempTrade: stateObj => stateObj.temp,
  currentTrade: stateObj => stateObj.current,
  savedTrades: stateObj => stateObj.savedTrades,
};

// actions
const actions = {
  addPickToTrade({ commit }, { data }) {
    // all trades start by adding a pick, check if this is adding pick to existing trade
    // or create a new temp one
    if (!(data.id)) {
      data.id = +new Date();
      commit(types.CREATE_TRADE, { data });
      return;
    }

    if (data.teamA === state.temp.teamA) {
      commit(types.ADD_PICK_TO_TEAM_A, data.pick);
    }
    if (data.teamB === state.temp.teamB) {
      commit(types.ADD_PICK_TO_TEAM_B, data.pick);
    }
  },
  removePickFromTrade({ commit }, { data }) {
    if (data.teamA === state.temp.teamA) {
      commit(types.REMOVE_PICK_FROM_TEAM_A, data.pick);
    }
    if (data.teamB === state.temp.teamB) {
      commit(types.REMOVE_PICK_FROM_TEAM_B, data.pick);
    }
  },
  getSavedTrades({ commit }) {
    const savedTrades = JSON.parse(window.localStorage.getItem('draftnik_saved_trades')) || [];
    commit(types.RECEIVE_TRADES, { savedTrades });
  },
};

// mutations
const mutations = {
  [types.RECEIVE_TRADES](stateObj, { savedTrades }) {
    stateObj.savedTrades = savedTrades;
  },
  [types.ADD_PICK_TO_TEAM_A](stateObj, pick) {
    stateObj.teamAPicks.push(pick);
  },
  [types.ADD_PICK_TO_TEAM_B](stateObj, pick) {
    stateObj.teamBPicks.push(pick);
  },
  [types.REMOVE_PICK_FROM_TEAM_A](stateObj, pick) {
    stateObj.teamAPicks.splice(stateObj.teamAPicks.indexOf(pick), 1);
  },
  [types.REMOVE_PICK_FROM_TEAM_B](stateObj, pick) {
    stateObj.teamBPicks.splice(stateObj.teamBPicks.indexOf(pick), 1);
  },
  // eslint-disable-next-line no-unused-vars
  [types.CLEAR_TRADE](stateObj) {
    stateObj.temp = {};
  },
  [types.CREATE_TRADE](stateObj, { tradeProps }) {
    stateObj.temp = new Trade(tradeProps);
  },
  [types.LOAD_TRADE](stateObj, { trade }) {
    stateObj.current = trade;
  },
  [types.SAVE_TRADE](stateObj, { trade }) {
    stateObj.savedTrades.push(trade);

    window.localStorage.set('draftnik_saved_trades', stateObj.savedTrades);
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
