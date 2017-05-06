/* eslint-disable */
import get from 'lodash/get';
import reduce from 'lodash/reduce';
import isArray from 'lodash/isArray';
import store from '../store';
import doddsCalculator from './dodds-calculator';

export const calculateDoddsTradeValue = doddsCalculator;

export const roundPicksMap = (picks) => {
  /*
    return an array that contains a sub-array for each round, containing
    each pick as an object
    e.g.
    [
      [ // round 1
        {...pick1},
        {...pick2}
      ],
      [ // round 2
        {...pick13},
      ]
    ]
  */
  return picks.reduce((acc, cur) => {
    const roundIndex = cur.round - 1;
    if (isArray(acc[roundIndex])) {
      acc[roundIndex].push(cur);
    } else {
      acc[roundIndex] = [cur];
    }

    return acc;
  }, []);
};

export const roundPicksTeamMap = (picks, order) => {
  /*
    Much like roundPicksMap, we want to end up with an array of rounds, but instead
    of a flat sub-array containing a single object for each pick, we want to
    group the pcks by the team that owns them. This is done by fetching the index
    of the team who owns the pick from the 'order' provided and grouping only those
    picks who belong to the same team together within a round. If a player has no
    picks in a round, they will have an empty array
  */

  const mappedPicks = [];

  picks.forEach((round, i) => {
    mappedPicks[i] = [];
    round.forEach((pick, j) => {
      // create empty array for each "pick" (team draft slot)
      if (!(isArray(mappedPicks[i][j]))) {
        mappedPicks[i][j] = [];
      }

      const team = order.indexOf(pick.team);
      // check if already created or not, and add pick to correct team slot
      if (isArray(mappedPicks[i][team])) {
        mappedPicks[i][team].push(pick);
      } else {
        mappedPicks[i][team] = [pick];
      }
    });
  });

  return mappedPicks;
};

export const getTeamById = (id) => get(store.getters.allUsers, id, {});

export const getUserById = getTeamById;

export const getPickValue = (pickNumber) => {
  const pick = store.getters.bayesianValues.find(p => p.overall === pickNumber);
  return pick.value;
};

export const getPlayersInRange = (pick, range) => {
  range = range || 2;
  pick = (pick >= range) ? pick : range;
  // map players by IDs and find the 3 players around the current pick in the format
  // n-1, n, n+1
  return store.getters.adp.slice(pick - range, pick + range);
};

export const calculateBayesianTradeValue = (trade) => {
  function getTotal(picks) {
    return reduce(picks, (total, pick) => {
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
  calculateBayesianTradeValue,
  calculateDoddsTradeValue,
};
