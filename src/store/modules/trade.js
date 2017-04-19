import keys from 'lodash/keys';
import map from 'lodash/map';
import * as types from '../mutations';
import api from '../../api';
import { db } from '../../database';

// eslint-disable-next-line
const Trade = (tradeProps) => {

  return {
    id: tradeProps.id,
    givingTeam: tradeProps.givingTeam,
    receivingTeam: tradeProps.receivingTeam,
    givingPicks: tradeProps.givingPicks || [],
    receivingPicks: tradeProps.receivingPicks || [],
  };
};

// initial state
const state = {
  current: {},
  userTrades: {},
};

// getters
const getters = {
  currentTrade: stateObj => stateObj.current,
  userTrades: stateObj => stateObj.userTrades,
  getTradeById: stateObj => tradeId => stateObj.userTrades[tradeId],
};

// actions
const actions = {
  createNewTrade({ commit }, data) {
    data.id = +new Date();

    commit(types.CREATE_TRADE, { data });
    if (data.pick.team === data.givingTeam) {
      commit(types.ADD_GIVING_TEAM_PICK, data.pick);
    }
    if (data.pick.team === data.receivingTeam) {
      commit(types.ADD_RECEIVING_TEAM_PICK, data.pick);
    }
  },
  addPickToTrade({ commit }, data) {
    // we already had a trade on the go, but all picks got emptied and the
    // receiving team has now changed
    if (data.receivingTeam !== state.current.receivingTeam &&
      state.current.receivingPicks.length === 0) {
      commit(types.CHANGE_RECEIVING_TEAM, data.receivingTeam);
    }

    if (data.givingTeam === state.current.givingTeam) {
      if (data.pick.team === data.givingTeam) {
        commit(types.ADD_GIVING_TEAM_PICK, data.pick);
      }
    }

    // only allow picks from the team currently in discussions
    if (data.receivingTeam === state.current.receivingTeam) {
      if (data.pick.team === data.receivingTeam) {
        commit(types.ADD_RECEIVING_TEAM_PICK, data.pick);
      }
    }
  },
  removePickFromTrade({ commit }, data) {
    if (data.givingTeam === state.current.givingTeam) {
      commit(types.REMOVE_GIVING_TEAM_PICK, data.pick);
    }
    if (data.receivingTeam === state.current.receivingTeam) {
      commit(types.REMOVE_RECEIVING_TEAM_PICK, data.pick);
    }

    // have removed all receiving picks so remove trade partner
    // but leave our picks in place (if we have any)
    if (state.current.receivingPicks.length === 0) {
      commit(types.CLEAR_RECEIVING_TEAM);

      // have also removed all of our own picks
      if (state.current.givingPicks.length === 0) {
        commit(types.CLEAR_TRADE);
      }
    }
  },
  getUserTrades({ commit }, data) {
    api.getUserTrades(data.draft, data.user, userTrades => {
      const tradeIds = Object.keys(userTrades);
      const ref = db.ref(`trades/${data.draft}`);
      const trades = {};

      Promise.all(
        tradeIds.map((id) => new Promise((resolve) => {
          ref.child(id).on('value', trade => {
            trades[id] = trade.val();
            resolve();
          });
        })),
      ).then(() => {
        commit(types.RECEIVE_USER_TRADES, trades);
      });
    });
  },
  getTrade({ commit }, data) {
    api.getTrade(data.draft, data.tradeId).then(response => {
      commit(types.RECEIVED_TRADE, response);
    }).catch(error => {
      console.error(error);
    });
  },
  proposeTrade({ commit }, { trade, draft }) {
    const tradeKey = db.ref('trades').push().key;
    const users = [trade.givingTeam, trade.receivingTeam];

    api.proposeTrade(draft, trade, tradeKey).then(() => {
      Promise.all(
        users.map(user => api.addTradeToUser(draft, user, tradeKey)),
      ).then(() => {
        commit(types.PROPOSED_TRADE, tradeKey);
      });
    });
  },
  rejectTrade({ commit }, { trade, draft }) {
    api.rejectTrade({ trade, draft }).then(() => {
      commit(types.REJECTED_TRADE, trade);
    }).catch(error => {
      console.error(error);
    });
  },
  withdrawTrade({ commit }, { trade, draft }) {
    api.withdrawTrade({ trade, draft }).then(() => {
      commit(types.WITHDRAWN_TRADE, trade);
    }).catch(error => {
      console.error(error);
    });
  },
  acceptTrade({ commit }, payload) {
    const {
      trade,
      draft,
      givingTeam,
      givingPicks,
      receivingTeam,
      receivingPicks,
    } = payload;

    api.acceptTrade({ trade, draft }).then(() => {
      Promise.all([
        api.addTradeToAccepted({ trade, draft }),
        ...map(keys(givingPicks), (pick) => api.changePickOwner({
          pick,
          draft,
          team: receivingTeam,
        })),
        ...map(keys(receivingPicks), (pick) => api.changePickOwner({
          pick,
          draft,
          team: givingTeam,
        })),
      ]).then(() => {
        commit(types.ACCEPTED_TRADE, trade);
      }).catch((error) => {
        console.error(error);
      });
    });
  },
};

// mutations
const mutations = {
  [types.SELECT_GIVING_TEAM](stateObj, userId) {
    stateObj.givingTeam = userId;
  },
  [types.ADD_GIVING_TEAM_PICK](stateObj, pick) {
    stateObj.current.givingPicks.push(pick);
  },
  [types.ADD_RECEIVING_TEAM_PICK](stateObj, pick) {
    stateObj.current.receivingPicks.push(pick);
  },
  [types.REMOVE_GIVING_TEAM_PICK](stateObj, pick) {
    stateObj.current.givingPicks = stateObj.current.givingPicks.filter(p =>
      p.overall !== pick.overall,
    );
  },
  [types.REMOVE_RECEIVING_TEAM_PICK](stateObj, pick) {
    stateObj.current.receivingPicks = stateObj.current.receivingPicks.filter(p =>
      p.overall !== pick.overall,
    );
  },
  [types.CLEAR_TRADE](stateObj) {
    stateObj.current = {};
  },
  [types.CLEAR_RECEIVING_TEAM](stateObj) {
    stateObj.current.receivingTeam = null;
  },
  [types.CHANGE_RECEIVING_TEAM](stateObj, team) {
    stateObj.current.receivingTeam = team;
  },
  [types.CREATE_TRADE](stateObj, { data }) {
    stateObj.current = new Trade(data);
  },
  [types.LOAD_TRADE](stateObj, { trade }) {
    stateObj.current = trade;
  },
  [types.RECEIVE_USER_TRADES](stateObj, trades) {
    stateObj.userTrades = trades;
  },
  [types.SAVE_TRADE](stateObj, { trade }) {
    stateObj.savedTrades.push(trade);
  },
  [types.PROPOSED_TRADE](stateObj, trade) {
    console.log(trade);
  },
  [types.REJECTED_TRADE](stateObj, trade) {
    console.log(trade);
  },
  [types.WITHDRAWN_TRADE](stateObj, trade) {
    console.log(trade);
  },
  [types.ACCEPTED_TRADE](stateObj, trade) {
    console.log(trade);
  },
  [types.DESTROY_SESSION](stateObj) {
    stateObj.userTrades = [];
    stateObj.current = {};
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
