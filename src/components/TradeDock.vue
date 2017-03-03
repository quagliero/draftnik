<template>
  <div v-if="hasTrade" class="trade-dock">
    <div class="container">
      <div class="level">
        <div class="level-left">
          <b v-if="receivingTeam">Trading with {{ receivingTeam.name }}:&nbsp;</b>
          <span v-html="currentGivingPicks"></span>
          <span v-html="currentReceivingPicks"></span>
        </div>
        <div class="level-right">
          <button class="delete"></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { getTeamById } from '../utils';

  export default {
    name: 'trade-dock',
    computed: {
      ...mapGetters([
        'currentTrade',
      ]),
      hasTrade() {
        return this.currentTrade.id &&
        (this.currentTrade.givingPicks.length || this.currentTrade.receivingPicks.length);
      },
      currentGivingPicks() {
        const givingPicks = this.currentTrade.givingPicks.slice(0);

        if (givingPicks.length) {
          return `You give <b>${this.displayPicks(givingPicks)}</b> and receive `;
        }

        return '';
      },
      currentReceivingPicks() {
        const receivingPicks = this.currentTrade.receivingPicks.slice(0);

        if (receivingPicks.length) {
          return `<b>${this.displayPicks(receivingPicks)}</b>`;
        }

        return '';
      },
      receivingTeam() {
        return getTeamById(this.currentTrade.receivingTeam);
      },
    },
    methods: {
      displayPicks(picks) {
        return picks.sort((a, b) => a.overall - b.overall).map(pick =>
          `${pick.round}.${pick.pickInRound} (#${pick.overall})`,
        ).join(',');
      },
    },
  };
</script>

<style lang="scss">
  @import '~bulma/variables';

  .trade-dock {
    position: relative;
    z-index: 3;
    padding-top: $size-7;
    padding-bottom: $size-7;
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: $dark;
    color: $light
  }

</style>
