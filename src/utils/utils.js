function roundPicksMap(rounds, picks) {
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
}

export default roundPicksMap;
