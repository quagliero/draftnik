import store from '../store';
import { calculateDoddsTradeValue } from './dodds-calculator';

export const roundPicksMap = (picks) => {
  const map = {};

  picks.forEach((pick) => {
    if (Array.isArray(map[pick.round])) {
      map[pick.round].push(pick);
    } else {
      map[pick.round] = [pick];
    }
  });

  /* should end up with
    {
      1: [ {
          team: 2,
          overall: 34,
          round: 2,
          pickInRound: 10
        },
        ..],
      ..
    }
  */

  return map;
};

export const getTeamById = (id) => store.getters.allUsers[id];

export const getPickValue = (pickNumber) => {
  const pick = store.getters.bayesianValues.find(p => p.overall === pickNumber);
  return pick.value;
};

export const getPlayersInRange = (pick) => {
  pick = (pick >= 2) ? pick : 2;
  // map players by IDs and find the 3 players around the current pick in the format
  // n-1, n, n+1
  const adpChunk = store.getters.adp.slice(pick - 2, pick + 2);

  // format it
  return adpChunk.map(p => p.player.name.split(', ').reverse().join(' ')).join(', ');
};

export const calculateBayesianTradeValue = (trade) => {
  function getTotal(picks) {
    return picks.reduce((total, pick) => {
      const bayesianPick = store.getters.bayesianValues.find(p => p.overall === pick.overall);
      return total + bayesianPick.value;
    }, 0);
  }

  function getDifference(giving, receiving) {
    if (giving > 0 && receiving > 0) {
      return ((receiving / giving) - 1) * 100;
    }

    return 0;
  }

  const givingValue = getTotal(trade.givingPicks);
  const receivingValue = getTotal(trade.receivingPicks);
  const difference = getDifference(givingValue, receivingValue);


  return {
    givingValue,
    receivingValue,
    difference,
  };
};

export default {
  roundPicksMap,
  getTeamById,
  getPickValue,
  getPlayersInRange,
  calculateDoddsTradeValue,
};
