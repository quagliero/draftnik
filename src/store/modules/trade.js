import { set } from 'vue';
import { database as fireDb } from 'firebase';
import keys from 'lodash/keys';
import map from 'lodash/map';
import filter from 'lodash/filter';
import some from 'lodash/some';
import * as types from '../mutations';
import api from '../../api';
import { db } from '../../database';
import { TradeStatus } from '../../constants';

// eslint-disable-next-line
const Trade = (tradeProps) => {
  return {
    id: tradeProps.id,
    givingTeam: tradeProps.givingTeam,
    receivingTeam: tradeProps.receivingTeam,
    givingPicks: tradeProps.givingPicks || [],
    receivingPicks: tradeProps.receivingPicks || [],
    message: tradeProps.message,
  };
};

// initial state
const state = {
  current: {},
  userTrades: {},
  acceptedTrades: {},
  receivedUserTrades: false,
};

// getters
const getters = {
  currentTrade: stateObj => stateObj.current,
  userTrades: stateObj => stateObj.userTrades,
  receivedUserTrades: stateObj => stateObj.receivedUserTrades,
  acceptedTrades: stateObj => stateObj.acceptedTrades,
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
  getAcceptedTrades({ commit }, { draft }) {
    api.once(`tradesAccepted/${draft}`).then((snapshot) => {
      const tradeIds = keys(snapshot.val());
      Promise.all(
        tradeIds.map((id) => api.once(`trades/${draft}/${id}`).then((snap) => snap.val())),
      ).then((trades) => {
        commit(types.RECEIVE_ACCEPTED_TRADES, trades);
      });
    });
  },
  getUserTrades({ commit }, { draft, user }) {
    const url = `tradesUsersPivot/${draft}/${user}`;
    const ref = db.ref(`trades/${draft}`);
    const getUserTrade = (key) => {
      ref.child(key).on('value', (childSnapshot) => {
        const trade = childSnapshot.val();
        commit(types.RECEIVE_USER_TRADE, trade);
      });
    };

    // fetch trades once so we know we have them
    api.once(url).then((snap) => {
      commit(types.RECEIVE_USER_TRADES, snap.val());
      // replace the trades with the dynamic ones
      api.listenForAddedEvents(url, (snapshot) => getUserTrade(snapshot.key));
      api.listenForChangeEvents(url, (snapshot) => getUserTrade(snapshot.key));
    });
  },
  proposeTrade({ commit }, { trade, draft }) {
    const tradeKey = db.ref('trades').push().key;
    const users = [trade.givingTeam, trade.receivingTeam];
    const payload = {
      id: tradeKey,
      givingTeam: trade.givingTeam,
      receivingTeam: trade.receivingTeam,
      givingPicks: trade.givingPicks,
      receivingPicks: trade.receivingPicks,
      status: TradeStatus.OFFERED,
      createdAt: fireDb.ServerValue.TIMESTAMP,
    };

    if (trade.message != null) {
      payload.message = trade.message;
    }

    return new Promise((resolve, reject) => {
      api.set(`trades/${draft}/${tradeKey}`, payload).then(() => {
        Promise.all(
          users.map(user => api.set(`tradesUsersPivot/${draft}/${user}/${tradeKey}`, true)),
        ).then(() => {
          commit(types.PROPOSED_TRADE, tradeKey);
          resolve();
        }).catch((err) => {
          reject(err);
        });
      });
    });
  },
  rejectTrade({ commit }, { trade, draft }) {
    api.update(`trades/${draft}/${trade}`, {
      status: TradeStatus.REJECTED,
      closedAt: fireDb.ServerValue.TIMESTAMP,
    }).then(() => {
      commit(types.REJECTED_TRADE, trade);
    }).catch(error => {
      console.error(error);
    });
  },
  withdrawTrade({ commit }, { trade, draft }) {
    api.update(`trades/${draft}/${trade}`, {
      status: TradeStatus.WITHDRAWN,
      closedAt: fireDb.ServerValue.TIMESTAMP,
    }).then(() => {
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

    api.update(`trades/${draft}/${trade}`, {
      status: TradeStatus.ACCEPTED,
      closedAt: fireDb.ServerValue.TIMESTAMP,
    }).then(() => {
      Promise.all([
        api.set(`tradesAccepted/${draft}/${trade}`, true),
        ...map(keys(givingPicks), (pick) => api.set(`drafts/${draft}/picks/${pick}/team`, receivingTeam)),
        ...map(keys(receivingPicks), (pick) => api.set(`drafts/${draft}/picks/${pick}/team`, givingTeam)),
      ]).then(() => {
        // mark as accepted
        commit(types.ACCEPTED_TRADE, trade);
        // tidy up any potential conflicting open offers
        const openOffers = filter(state.userTrades, (userTrade) => {
          if (userTrade.id !== trade && userTrade.status === TradeStatus.OFFERED) {
            return true;
          }
          return false;
        });

        Promise.all([
          ...map(openOffers, (offer) => {
            if (some([
              some(keys(offer.givingPicks), pick => givingPicks[pick]),
              some(keys(offer.receivingPicks), pick => givingPicks[pick]),
              some(keys(offer.givingPicks), pick => receivingPicks[pick]),
              some(keys(offer.receivingPicks), pick => receivingPicks[pick]),
            ])) {
              return api.update(`trades/${draft}/${offer.id}`, {
                status: TradeStatus.WITHDRAWN,
                closedAt: fireDb.ServerValue.TIMESTAMP,
              });
            }

            return null;
          }),
        ]);
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
  [types.ADD_TRADE_MESSAGE](stateObj, message) {
    stateObj.current.message = message;
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
  [types.RECEIVE_ACCEPTED_TRADES](stateObj, acceptedTrades) {
    stateObj.acceptedTrades = acceptedTrades;
  },
  [types.RECEIVE_USER_TRADE](stateObj, trade) {
    set(stateObj.userTrades, trade.id, trade);
  },
  [types.RECEIVE_USER_TRADES](stateObj, trades) {
    stateObj.receivedUserTrades = true;
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
    stateObj.userTrades = {};
    stateObj.current = {};
    stateObj.receivedUserTrades = false;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
