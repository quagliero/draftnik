<template>
  <div class="panel-block">
    <div class="trade-panel">
      <div>
        <span
          :class="['tag', tradeStatusClass]"
        >
          {{ tradeStatus }}
        </span>
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
  import { TradeStatus } from '../../../constants';

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
        switch (this.trade.status) {
          case TradeStatus.OFFERED:
            return 'Offer';
          case TradeStatus.ACCEPTED:
            return 'Accepted';
          case TradeStatus.REJECTED:
            return 'Rejected';
          case TradeStatus.WITHDRAWN:
            return 'Withdrawn';
          default:
            return 'Offer';
        }
      },
      tradeStatusClass() {
        switch (this.trade.status) {
          case TradeStatus.OFFERED:
            return 'is-primary';
          case TradeStatus.ACCEPTED:
            return 'is-success';
          case TradeStatus.REJECTED:
            return 'is-danger';
          case TradeStatus.WITHDRAWN:
            return 'is-danger';
          default:
            return 'is-info';
        }
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
        }, `<li style="display: block; text-decoration: underline;"><small>You ${type}:</small></li>`);
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
