<template>
  <div v-if="hasTrade" class="trade-dock">
    <div class="container">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <div class="trade-dock__picks">
              <div>
                <b v-if="currentTrade.givingPicks.length">You send:&nbsp;</b>
                <span v-if="currentGivingPicks.length">
                  <trade-dock-pick
                    v-for="pick in currentGivingPicks"
                    :pick="pick"
                     @click="onDockPickClick"
                  ></trade-dock-pick>
                </span>
              </div>
              <div  @onDockPickClick="onDockPickClick">
                <b v-if="receivingTeam">{{ receivingTeam.name }} sends:&nbsp;</b>
                <span v-if="currentReceivingPicks.length">
                  <trade-dock-pick
                    v-for="pick in currentReceivingPicks"
                    :pick="pick"
                     @click="onDockPickClick"
                  ></trade-dock-pick>
                </span>
              </div>
            </div>
          </div>
          <div class="level-item">
            <div class="trade-dock__calc">
              <img v-if="BayesianTradeCalculator" width="40" height="40" class="trade-dock__img" src="/static/img/bayesian.png" alt="Bayesian"/>
              <div v-html="BayesianTradeCalculator"></div>
            </div>
          </div>
          <div class="level-item">
            <div class="trade-dock__calc trade-dock__calc--doddsy">
              <img v-if="DoddsTradeCalculator" width="40" height="40" class="trade-dock__img" src="/static/img/dodds.png" alt="Doddsy"/>
              <span v-html="DoddsTradeCalculator"></span>
            </div>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <button v-if="canMakeOffer" class="button is-outlined is-primary is-inverted">
              Make Offer
            </button>
          </div>
          <!-- <button class="delete"></button> -->
        </div>
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
        const givingPicks = this.currentTrade.givingPicks.slice(0);

        if (givingPicks.length) {
          return this.sortPicks(givingPicks);
        }

        return [];
      },
      currentReceivingPicks() {
        const receivingPicks = this.currentTrade.receivingPicks.slice(0);

        if (receivingPicks.length) {
          return this.sortPicks(receivingPicks);
        }

        return [];
      },
      receivingTeam() {
        return getTeamById(this.currentTrade.receivingTeam);
      },
      DoddsTradeCalculator() {
        const doddsCalc = calculateDoddsTradeValue(this.currentTrade);

        if (doddsCalc.difference === 0) {
          return '';
        }

        return `${doddsCalc.difference.toFixed(2)}%<br />&ldquo;${doddsCalc.verdict}&rdquo;`;
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
    padding-top: $size-7;
    padding-bottom: $size-7;
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

  .trade-dock__calc {
    margin-left: 2rem;
    display: flex;
    align-items: flex-start;
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
    width: 40px;
    height: 40px;
    border: 2px solid $white-ter;
  }

</style>
