<template>
  <div class="panel-block">
    <i :class="['fa', userProposed ? 'fa-arrow-right' : 'fa-arrow-left']"></i>
    {{ (userProposed ? receivingTeam : givingTeam).displayName }}
    <ul>
      <li v-for="pick in (userProposed ? receivingPicks : givingPicks)">
        {{ pick.round }}.{{ pick.pickInRound }} ({{ pick.overall }})
      </li>
    </ul>
    <ul>
      <li v-for="pick in (userProposed ? givingPicks : receivingPicks)">
        {{ pick.round }}.{{ pick.pickInRound }} ({{ pick.overall }})
      </li>
    </ul>
    <router-link :to="{ name: 'trade', params: { id: trade.id }}">View trade</router-link>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import map from 'lodash/map';
  import keys from 'lodash/keys';
  import { getTeamById } from '../../../utils';

  export default {
    name: 'trade-panel',
    props: [
      'trade',
      'currentUser',
    ],
    computed: {
      ...mapGetters([
        'pickById',
      ]),
      givingTeam() {
        return getTeamById(this.trade.givingTeam);
      },
      receivingTeam() {
        return getTeamById(this.trade.receivingTeam);
      },
      givingPicks() {
        return map(keys(this.trade.givingPicks), pick => this.pickById(pick));
      },
      receivingPicks() {
        return map(keys(this.trade.receivingPicks), pick => this.pickById(pick));
      },
      userProposed() {
        return (this.trade.givingTeam === this.currentUser.id);
      },
    },
    methods: {
      renderPicks(picks) {
        return Object.keys(picks).map(k => k);
      },
    },
  };
</script>
