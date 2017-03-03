<template>
<div>
  <div v-if="hasTrade" class="trade-dock">
    <transition name="slide-up">
      <div v-if="showTradeValidation" class="trade-dock__notifications">
        <div class="notification is-danger">
          <button class="delete" @click="showTradeValidation = false"></button>
          An even amount of picks must be exchanged.
          You are giving {{ givingPicks.length }}, and receiving {{ receivingPicks.length }}.
        </div>
      </div>
    </transition>
    <div class="container trade-dock__inner">
      <div class="level">
        <div class="level-item">
          <div class="trade-dock__picks">
            <div class="trade-dock__giving" v-if="currentTrade.givingPicks.length">
              <b>You send:&nbsp;</b>
              <trade-dock-pick
                v-for="(pick, i) in givingPicks"
                :pick="pick"
                 @click="onDockPickClick"
              >{{ (i !== givingPicks.length - 1) ? ',' : ''}}
              </trade-dock-pick>
            </div>
            <div class="trade-dock__receiving" v-if="receivingPicks.length">
              <b v-if="receivingTeam">{{ receivingTeam.name }} sends:&nbsp;</b>
              <trade-dock-pick
                v-for="(pick, i) in receivingPicks"
                :key="pick.overall"
                :pick="pick"
                 @click="onDockPickClick"
              >{{ (i !== receivingPicks.length - 1) ? ',' : ''}}
              </trade-dock-pick>
            </div>
          </div>
        </div>

        <div class="level-item">
          <div class="trade-dock__calc">
            <img v-if="BayesianTradeCalculator" class="trade-dock__img" src="/static/img/bayesian.png" alt="Bayesian"/>
            <span v-html="BayesianTradeCalculator"></span>
          </div>
          <div class="trade-dock__calc">
            <img v-if="DoddsTradeCalculator" class="trade-dock__img" src="/static/img/dodds.png" alt="Doddsy"/>
            <span v-html="DoddsTradeCalculator"></span>
          </div>
        </div>
        <div class="level-item">
          <div class="trade-dock__action">
            <button
              v-if="canMakeOffer"
              class="button is-medium is-outlined is-primary is-inverted"
              @click="onMakeOfferClick"
            >
              Make Offer
            </button>
          </div>
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
    data() {
      return {
        showTradeValidation: false,
      };
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
      givingPicks() {
        return this.sortPicks(this.currentTrade.givingPicks.slice(0));
      },
      receivingPicks() {
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
      onMakeOfferClick(event) {
        if (this.givingPicks.length !== this.receivingPicks.length) {
          this.showTradeValidation = true;
          return;
        }

        event.target.classList.add('is-loading');
        event.target.disabled = true;
        event.target.classList.remove('is-inverted');

        // make trade offer
        setTimeout(() => {
          event.target.classList.remove('is-loading');
          event.target.disabled = false;
          event.target.classList.add('is-inverted', 'is-outlined');
        }, 1000);
      },
    },
  };
</script>

<style lang="scss">
  @import '~bulma/variables';

  .trade-dock {
    position: relative;
    z-index: 3;
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: $dark;
    color: $light;
    text-align: left;
  }

  .trade-dock__inner {
    background-color: $dark;
    padding: 5px 20px 5px;
    z-index: 3;
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

  .trade-dock__img {
    border-radius: 100%;
    margin-right: 10px;
    vertical-align: middle !important;
    width: 25px;
    height: 25px;
    border: 2px solid $white-ter;
  }

  .trade-dock__action {
    text-align: right;

    .button {
      @media screen and (max-width: 769px) {
        margin: 20px auto;
        width: 100%;
        max-width: 360px;
        display: block;
      }
    }
  }

  .trade-dock__notifications {
    position: absolute;
    bottom: 100%;
    margin-bottom: 10px;
    left: 20px;
    right: 20px;
    z-index: 2;
  }

  .slide-up-enter-active, .slide-up-leave-active {
    transition: bottom .2s ease-in-out;
  }

  .slide-up-enter, .slide-up-leave-active {
    bottom: 0%;
  }

</style>
