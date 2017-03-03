<template>
  <div v-if="hasTrade" class="trade-dock">
    <div class="container">
      <div class="level">

          <div class="level-item">
            <div class="trade-dock__picks">
              <div class="trade-dock__giving" v-if="currentTrade.givingPicks.length">
                <b>You send:&nbsp;</b>
                <trade-dock-pick
                  v-for="(pick, i) in currentGivingPicks"
                  :pick="pick"
                   @click="onDockPickClick"
                >{{ (i !== currentGivingPicks.length - 1) ? ',' : ''}}
                </trade-dock-pick>
              </div>
              <div class="trade-dock__receiving" v-if="currentReceivingPicks.length">
                <b v-if="receivingTeam">{{ receivingTeam.name }} sends:&nbsp;</b>
                <trade-dock-pick
                  v-for="(pick, i) in currentReceivingPicks"
                  :key="pick.overall"
                  :pick="pick"
                   @click="onDockPickClick"
                >{{ (i !== currentReceivingPicks.length - 1) ? ',' : ''}}
                </trade-dock-pick>
              </div>
            </div>
          </div>

          <div class="level-item">
            <div class="trade-dock__calc">
              <img v-if="BayesianTradeCalculator" class="trade-dock__img" src="/static/img/bayesian.png" alt="Bayesian"/>
              <span v-html="BayesianTradeCalculator"></span>
            </div>
            <div class="trade-dock__calc trade-dock__calc--doddsy">
              <img v-if="DoddsTradeCalculator" class="trade-dock__img" src="/static/img/dodds.png" alt="Doddsy"/>
              <span v-html="DoddsTradeCalculator"></span>
            </div>
          </div>
          <div class="level-item" style="text-align: right;">
            <button v-if="canMakeOffer" class="button is-outlined is-primary is-inverted">
              Make Offer
            </button>
          </div>
          <!-- <button class="delete"></button> -->

      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex';
  import { SELECT_PICK } from '../store/mutations';
  import TradeDockPick from './TradeDock/Pick.vue';
  import {
    getTeamById,
    calculateBayesianTradeValue,
  } from '../utils';
  import { calculateDoddsTradeValue } from '../utils/dodds-calculator';

  export default {
    name: 'trade-dock',
    components: {
      TradeDockPick,
    },
    computed: {
      ...mapGetters([
        'currentTrade',
      ]),
      hasTrade() {
        return this.currentTrade.id &&
        (this.currentTrade.givingPicks.length || this.currentTrade.receivingPicks.length);
      },
      canMakeOffer() {
        return this.hasTrade &&
                this.currentTrade.givingPicks.length &&
                this.currentTrade.receivingPicks.length;
      },
      currentGivingPicks() {
        return this.sortPicks(this.currentTrade.givingPicks.slice(0));
      },
      currentReceivingPicks() {
        return this.sortPicks(this.currentTrade.receivingPicks.slice(0));
      },
      receivingTeam() {
        return getTeamById(this.currentTrade.receivingTeam);
      },
      DoddsTradeCalculator() {
        const doddsCalc = calculateDoddsTradeValue(this.currentTrade);

        if (doddsCalc.difference === 0) {
          return '';
        }

        return `${doddsCalc.difference.toFixed(2)}% &ndash; <small><em>&ldquo;${doddsCalc.verdict}&rdquo;</em></small>`;
      },
      BayesianTradeCalculator() {
        const bayesianCalc = calculateBayesianTradeValue(this.currentTrade);

        if (bayesianCalc.difference === 0) {
          return '';
        }

        return `${bayesianCalc.difference.toFixed(2)}%`;
      },
    },
    methods: {
      ...mapMutations({
        SELECT_PICK,
      }),
      sortPicks(picks) {
        return picks.sort((a, b) => a.overall - b.overall);
      },
      onDockPickClick(pick) {
        this.SELECT_PICK({ pick });
        this.$emit('onDockPickClick');
      },
    },
  };
</script>

<style lang="scss">
  @import '~bulma/variables';

  .trade-dock {
    position: relative;
    z-index: 3;
    padding: 5px 20px 5px;
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: $dark;
    color: $light;
    text-align: left;
  }

  .trade-dock__picks {
    display: flex;
    flex-direction: column;
  }

  .trade-dock__giving,
  .trade-dock__receiving,
  .trade-dock__calc {
    line-height: 2;
  }

  .trade-dock__giving {
    // margin-bottom: 5px;
  }
  .trade-dock__receiving {
    // margin-top: 5px;
  }

  .trade-dock__calc {
    align-items: center;
    font-size: 1.2rem;
    font-weight: bold;
  }

  .trade-dock__calc--doddsy {
    font-size: 1.1rem;
    font-weight: bold;
  }

  .trade-dock__img {
    border-radius: 100%;
    margin-right: 10px;
    vertical-align: middle !important;
    width: 25px;
    height: 25px;
    border: 2px solid $white-ter;
  }

</style>
