<template>
  <div>
    <div class="message">
      <div class="message-header">
        <h6>draftpicktradecalculator.com</h6>
      </div>
      <div class="message-body">
        <div class="columns is-mobile is-gapless has-text-centered">
          <div class="column">
            {{ bayesianValue.givingValue.toFixed(2) }}
          </div>
          <div class="column">
            <span class="title is-4">{{ bayesianValue.difference.toFixed(2) }}%</span>
          </div>
          <div class="column">
            {{ bayesianValue.receivingValue.toFixed(2) }}
          </div>
        </div>
      </div>
    </div>
    <div class="message is-warning">
      <div class="message-header">
        <h6>footballguys.com</h6>
      </div>
      <div class="message-body">
        <div class="columns is-mobile is-gapless has-text-centered">
          <div class="column">
            {{ doddsValue.givingValue.toFixed(2) }}
          </div>
          <div class="column">
            <span class="title is-4">{{ doddsValue.difference.toFixed(2) }}%</span>
          </div>
          <div class="column">
            {{ doddsValue.receivingValue.toFixed(2) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import map from 'lodash/map';
  import keys from 'lodash/keys';
  import {
    calculateDoddsTradeValue,
    calculateBayesianTradeValue,
  } from '../../utils';

  export default {
    name: 'trade-calculators',
    props: ['trade'],
    computed: {
      ...mapGetters([
        'currentUser',
        'getPickById',
      ]),
      givingPicks() {
        const picks = (this.userProposed) ? this.trade.givingPicks : this.trade.receivingPicks;
        return map(keys(picks), pick => this.getPickById(pick));
      },
      receivingPicks() {
        const picks = (this.userProposed) ? this.trade.receivingPicks : this.trade.givingPicks;
        return map(keys(picks), pick => this.getPickById(pick));
      },
      userProposed() {
        return (this.trade.givingTeam === this.currentUser.id);
      },
      bayesianValue() {
        return calculateBayesianTradeValue({
          givingPicks: this.givingPicks,
          receivingPicks: this.receivingPicks,
        });
      },
      doddsValue() {
        return calculateDoddsTradeValue({
          givingPicks: this.givingPicks,
          receivingPicks: this.receivingPicks,
        });
      },
    },
  };
</script>
