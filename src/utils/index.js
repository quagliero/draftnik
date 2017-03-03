import store from '../store';
import { calculateDoddsTradeValue } from './dodds-calculator';

export const roundPicksMap = (rounds, picks) => {
  const map = {};
  const perRound = picks.length / rounds;

  let overall = 0;

  function getPick(pickNumber) {
    pickNumber = Number(pickNumber);
    return picks.filter(a => Number(a.overall) === pickNumber)[0];
  }

  for (let i = 1; i <= rounds; i += 1) {
    map[i] = [];
    for (let j = 1; j <= perRound; j += 1) {
      // increment the overall counter used to match the relevant pick
      overall += 1;
      // grab the corresponding pick
      const pick = getPick(overall);
      map[i].push({
        team: Number(pick.user_id),
        overall: Number(pick.overall),
        round: Number(i),
        pickInRound: Number(j),
      });
    }
  }

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

export const getTeamById = (id) => store.getters.teams.find(team => team.id === id);

export const getPickValue = (pickNumber) => {
  const pick = store.getters.bayesianValues.find(p => p.overall === pickNumber);
  return pick.value;
};

export const getPlayersInRange = (pick) => {
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
