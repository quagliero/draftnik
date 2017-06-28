/* eslint-disable */
function calculate(givingPicks, receivingPicks) {
  /* Footballguys.com Quik-Vu™ Pick Value Calculator is Copyright © 1997 David Dodds. */
  const getValue = (pick) => {
    const magic = 1959.184;
    const value = (pick.overall * pick.overall * pick.overall * pick.overall * pick.overall * pick.overall * 0.000000001059022)
    - (pick.overall * pick.overall * pick.overall * pick.overall * pick.overall * 0.0000007143797)
    + (pick.overall * pick.overall * pick.overall * pick.overall * 0.0001881737)
    - (pick.overall * pick.overall * pick.overall * 0.02460543)
    + (pick.overall * pick.overall * 1.724025)
    - (pick.overall * 71.53730);

    if (value < 0) {
      return Math.round(value + magic);
    }

    return 0;
  }

  const receivingValue = receivingPicks.reduce((acc, pick) => {
    return acc + getValue(pick);
  }, 0);
  const givingValue = givingPicks.reduce((acc, pick) => {
    return acc + getValue(pick);
  }, 0);
  let verdict;
  let difference = 0;

  if (givingValue < receivingValue) {
    verdict = 'You should make the trade';
  } else {
    verdict = 'You should NOT make the trade';
  }

  if (givingValue > 0 && receivingValue > 0) {
    difference = ((receivingValue / givingValue) - 1) * 100;
  }

  return {
    givingValue,
    receivingValue,
    difference,
    verdict,
  }
}

const doddsCalculator = (picks) => {
  const {
    receivingPicks,
    givingPicks,
  } = picks;

  return calculate(givingPicks, receivingPicks);
}
/* eslint-enable */
export default doddsCalculator;
