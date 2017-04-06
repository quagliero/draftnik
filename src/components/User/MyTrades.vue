<template>
  <div class="panel">
    <p class="panel-heading">My Trades</p>
    <div class="panel-block" v-for="trade in userTrades">
      <i :class="['fa', userProposed(trade) ? 'fa-arrow-right' : 'fa-arrow-left']"></i>
      {{ getTeamById(userProposed(trade) ? trade.receivingTeam : trade.givingTeam).displayName }}
      <ul>
        <li v-for="(pick, key) in (userProposed(trade) ? trade.receivingPicks : trade.givingPicks)">
          <router-link :to="{ name: 'trade', params: { id: key }}">Trade {{ key }}</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { getTeamById } from '../../utils';

  export default {
    name: 'my-trades',
    computed: {
      ...mapGetters([
        'currentDraft',
        'currentUser',
        'userTrades',
      ]),
    },
    methods: {
      getTeamById(id) {
        return getTeamById(id);
      },
      renderPicks(picks) {
        return Object.keys(picks).map(k => k);
      },
      userProposed(trade) {
        if (trade.givingTeam === this.currentUser.id) {
          return true;
        }

        return false;
      },
    },
    created() {
      this.$store.dispatch('getDrafts').then(() => {
        this.$store.dispatch('getUserTrades', {
          draft: this.currentDraft.id,
          user: this.currentUser.id,
        });
      });
    },
  };
</script>
