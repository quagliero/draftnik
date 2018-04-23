/* eslint-disable */
export const getDoddsPickValue = (pick) => {
  const magic = 1959.184;
  const value = (pick * pick * pick * pick * pick * pick * 0.000000001059022)
  - (pick * pick * pick * pick * pick * 0.0000007143797)
  + (pick * pick * pick * pick * 0.0001881737)
  - (pick * pick * pick * 0.02460543)
  + (pick * pick * 1.724025)
  - (pick * 71.53730);

  if (value < 0) {
    return Number(value + magic);
  }

  return 0;
};

const calculate = (givingPicks, receivingPicks) => {
  /* Footballguys.com Quik-Vu™ Pick Value Calculator is Copyright © 1997 David Dodds. */
  const receivingValue = receivingPicks.reduce((acc, pick) => {
    return acc + getDoddsPickValue(pick.overall);
  }, 0);
  const givingValue = givingPicks.reduce((acc, pick) => {
    return acc + getDoddsPickValue(pick.overall);
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
