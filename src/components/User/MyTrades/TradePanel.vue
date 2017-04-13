<template>
  <div class="panel-block">
    <div class="trade-panel">
      <div>
        <span class="tag is-warning">{{ tradeStatus }}</span>
        <router-link
          :to="{ name: 'trade', params: { id: trade.id }}"
          class="button is-small is-info pull-right"
        >
          View trade
        </router-link>
        <span class="icon is-small">
          <i :class="['fa', userProposed ? 'fa-arrow-right' : 'fa-arrow-left']"></i>
        </span>
        <strong>
          {{ otherTeam.displayName }}
        </strong>
      </div>
      <div>
        <ul class="trade-panel__picks" v-html="renderPickList('give')"/>
        <ul class="trade-panel__picks" v-html="renderPickList('get')"/>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import map from 'lodash/map';
  import keys from 'lodash/keys';
  import reduce from 'lodash/reduce';
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
      otherTeam() {
        return (this.userProposed) ? this.receivingTeam : this.givingTeam;
      },
      givingTeam() {
        return getTeamById(this.trade.givingTeam);
      },
      receivingTeam() {
        return getTeamById(this.trade.receivingTeam);
      },
      givingPicks() {
        const picks = (this.userProposed) ? this.trade.givingPicks : this.trade.receivingPicks;
        return map(keys(picks), pick => this.pickById(pick));
      },
      receivingPicks() {
        const picks = (this.userProposed) ? this.trade.receivingPicks : this.trade.givingPicks;
        return map(keys(picks), pick => this.pickById(pick));
      },
      userProposed() {
        return (this.trade.givingTeam === this.currentUser.id);
      },
      tradeStatus() {
        if (this.trade.isAccepted === true) {
          return 'Accepted';
        }
        if (this.trade.isRejected === true) {
          return 'Rejected';
        }

        return 'Offer';
      },
    },
    methods: {
      renderPickList(type) {
        const picks = (type === 'get') ? this.receivingPicks : this.givingPicks;
        const max = picks.length - 1;
        return reduce(picks, (acc, cur, i) => {
          const suffix = (max >= 1 && i < max) ? ', ' : '';
          acc += `<li>${cur.round}.${cur.pickInRound} (${cur.overall})${suffix}&nbsp;</li>`;
          return acc;
        }, `<li>You ${type}:&nbsp;</li>`);
      },
    },
  };
</script>

<style lang="scss">
  .trade-panel {
    width: 100%;
    text-align: left;

    .icon {
      vertical-align: text-top;
    }
  }

  .trade-panel__picks {
    margin-top: 1rem;
    > li {
      display: inline-block;
    }
  }
</style>
