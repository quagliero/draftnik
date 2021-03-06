<template>
<div>
  <div v-if="hasTrade" class="trade-dock">
    <div class="container">
      <transition name="slide-up">
        <div v-if="showTradeValidation" class="trade-dock__notifications">
          <div class="notification is-danger">
            <button class="delete" @click="showTradeValidation = false"></button>
            An even amount of picks must be exchanged.
            You are giving {{ givingPicks.length }}, and receiving {{ receivingPicks.length }}.
          </div>
        </div>
        <div v-if="showTradeSuccess" class="trade-dock__notifications">
          <div class="notification is-success">
            <button class="delete" @click="clearTrade"></button>
            <div class="trade-dock__success">
              <p style="margin-bottom: 1rem">Your trade offer has been sent!</p>
              <button
                class="button is-success is-inverted is-outlined"
                @click="offerComplete = false; showTradeSuccess = false;"
              >
                Make another?
              </button>
              <button class="button is-success" @click="clearTrade">
                I'm done, thanks
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <div class="trade-dock__inner">
      <div class="container">
        <div class="columns align-items-center">
          <div class="column is-4">
            <div class="trade-dock__picks">
              <div class="trade-dock__giving" v-if="currentTrade.receivingPicks.length">
                <b>You get:&nbsp;</b>
                <trade-dock-pick
                  v-for="(pick, i) in receivingPicks"
                  :key="pick.overall"
                  :pick="pick"
                   @click="onDockPickClick"
                >{{ (i !== receivingPicks.length - 1) ? ',' : ''}}
                </trade-dock-pick>
              </div>
              <div class="trade-dock__receiving" v-if="givingPicks.length">
                <b v-if="receivingTeam.displayName">{{ receivingTeam.displayName }} gets:&nbsp;</b>
                <b v-else>They get:&nbsp;</b>
                <trade-dock-pick
                  v-for="(pick, i) in givingPicks"
                  :key="pick.overall"
                  :pick="pick"
                   @click="onDockPickClick"
                >{{ (i !== givingPicks.length - 1) ? ',' : ''}}
                </trade-dock-pick>
              </div>
            </div>
          </div>

          <div
            class="column"
            v-if="canMakeOffer"
          >
            <div class="trade-dock__calcs">
              <div class="trade-dock__calc">
                <a href="http://www.draftpicktradecalculator.com/" target="_blank">
                  <img v-if="BayesianTradeCalculator" class="trade-dock__img" src="/static/img/bayesian.png" alt="Bayesian"/>
                  <span v-html="BayesianTradeCalculator"></span>
                </a>
              </div>
              <div class="trade-dock__calc">
                <a href="https://footballguys.com/pickvalue.htm" target="_blank">
                  <img v-if="DoddsTradeCalculator" class="trade-dock__img" src="/static/img/dodds.png" alt="Doddsy"/>
                  <span v-html="DoddsTradeCalculator"></span>
                </a>
              </div>
            </div>
          </div>
          <div class="column">
            <textarea
              v-show="canMakeOffer && showMessage && !offerComplete"
              v-model="message"
              placeholder="Add a message..."
              class="textarea trade-dock__message"
            />
            <div class="trade-dock__action">
              <button
                v-if="canMakeOffer && !offerComplete"
                class="button is-dark"
                @click="showMessage = !showMessage"
              >
                <span class="icon is-small">
                  <i class="fa fa-plus-circle"></i>
                  &nbsp;
                  <i class="fa fa-comment"></i>
                </span>
              </button>
              <button
                v-if="canMakeOffer"
                :class="['trade-dock__offer button is-outlined is-primary', {
                  'is-loading': offerProcessing,
                  'is-hidden': offerComplete,
                }]"
                @click="onMakeOfferClick"
                :disabled="offerProcessing"
              >
                <span class="icon is-small">
                  <i class="fa fa-paper-plane"></i>
                </span>
                <span>Make Offer</span>
              </button>
              <button
                @click="clearTrade"
                class="trade-dock__clear button is-dark is-outlined is-inverted"
              >
                <span class="icon is-small">
                  <i class="fa fa-times-circle"></i>
                </span>
                <span>Clear</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
  import { mapGetters, mapActions, mapMutations } from 'vuex';
  import reduce from 'lodash/reduce';
  import {
    SELECT_PICK,
    CLEAR_TRADE,
    CLEAR_RECEIVING_TEAM,
    ADD_TRADE_MESSAGE,
  } from '../store/mutations';
  import TradeDockPick from './TradeDock/Pick.vue';
  import {
    getTeamById,
    calculateBayesianTradeValue,
    calculateDoddsTradeValue,
  } from '../utils';

  export default {
    name: 'trade-dock',
    components: {
      TradeDockPick,
    },
    data() {
      return {
        showTradeValidation: false,
        showTradeSuccess: false,
        offerProcessing: false,
        offerComplete: false,
        showMessage: false,
      };
    },
    computed: {
      ...mapGetters([
        'currentTrade',
        'currentUser',
        'currentDraft',
      ]),
      message: {
        get() {
          return this.currentTrade.message;
        },
        set(value) {
          this.ADD_TRADE_MESSAGE(value);
        },
      },
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

        return `${doddsCalc.difference.toFixed(2)}%`;
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
        CLEAR_TRADE,
        CLEAR_RECEIVING_TEAM,
        ADD_TRADE_MESSAGE,

      }),
      ...mapActions([
        'proposeTrade',
      ]),
      sortPicks(picks) {
        return picks.sort((a, b) => a.overall - b.overall);
      },
      onDockPickClick(pick) {
        this.SELECT_PICK({ pick });
        this.$emit('onDockPickClick');
      },
      clearTrade() {
        this.offerComplete = false;
        this.showTradeSuccess = false;
        this.showMessage = false;
        this.CLEAR_TRADE();
        this.CLEAR_RECEIVING_TEAM();
      },
      onMakeOfferClick() {
        if (this.givingPicks.length !== this.receivingPicks.length) {
          this.showTradeValidation = true;
          return false;
        }

        this.offerProcessing = true;

        const trade = {
          givingTeam: this.currentTrade.givingTeam,
          receivingTeam: this.currentTrade.receivingTeam,
          givingPicks: reduce(this.currentTrade.givingPicks, (acc, cur) => {
            acc[cur.id] = true;
            return acc;
          }, {}),
          receivingPicks: reduce(this.currentTrade.receivingPicks, (acc, cur) => {
            acc[cur.id] = true;
            return acc;
          }, {}),
          message: this.message,
        };

        this.proposeTrade({ draft: this.currentDraft.id, trade }).then(() => {
          this.offerComplete = true;
          this.offerProcessing = false;
          this.showTradeSuccess = true;
        }).catch(() => {
          this.offerComplete = false;
          this.offerProcessing = false;
        });
        return true;
      },
    },
  };
</script>

<style lang="scss">
  @import '~bulma/utilities/variables';

  .trade-dock {
    position: relative;
    z-index: 5;
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
    padding: 0.75rem;
    z-index: 5;
  }

  .level-item--picks {
    max-width: 50%;
  }
  .trade-dock__picks {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .trade-dock__giving,
  .trade-dock__receiving,
  .trade-dock__calc {
    line-height: 2;
  }

  .trade-dock__calcs {
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }

  .trade-dock__calc {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    text-align: center;
    font-size: 1.2rem;
    font-weight: bold;

    a {
      color: white;

      &:hover, &:focus {
        text-decoration: underline;
      }
    }
  }

  .trade-dock__img {
    border-radius: 100%;
    margin-right: 5px;
    vertical-align: middle !important;
    width: 30px;
    height: 30px;
    border: 2px solid $white-ter;
  }

  .trade-dock__message {
    background-color: $grey-dark;
    color: $white;
    margin-left: 0;
    margin-right: 0;
    min-height: 2.3rem;
    font-size: 0.8rem;
    margin-bottom: 0.75rem;

    &::-webkit-input-placeholder { /* Chrome/Opera/Safari */
      color: $grey-lighter;
    }
    &::-moz-placeholder { /* Firefox 19+ */
      color: $grey-lighter;
    }
    &:-ms-input-placeholder { /* IE 10+ */
      color: $grey-lighter;
    }
    &:-moz-placeholder { /* Firefox 18- */
      color: $grey-lighter;
    }
  }

  .trade-dock__action {
    justify-content: flex-end;
    display: flex;
    width: 100%;

    .button {
      vertical-align: middle;
      text-align: center !important;
      margin-left: 0.75rem;

      &:first-of-type {
        margin-left: 0;
      }
    }

    @media screen and (max-width: $tablet) {
      display: flex;
      justify-content: center;
      margin-bottom: 10px;

      .button {
        line-height: 1.5;
        height: 2.285em;

        .fa {
          vertical-align: middle;
        }
      }
    }
  }

  .trade-dock__offer {
    flex: 3;
  }

  .trade-dock__clear {
  }

  .trade-dock__notifications {
    position: absolute;
    bottom: 100%;
    margin-bottom: 0.75rem;
    left: 0;
    right: 0;
    z-index: 4;
  }

  .trade-dock__success {
    text-align: center;

    .button {
      vertical-align: middle;
      margin-left: 1rem;
    }
  }

  .slide-up-enter-active, .slide-up-leave-active {
    opacity: 1;
    transition: opacity .3s ease-in-out, bottom .3s ease-in-out;
  }

  .slide-up-enter, .slide-up-leave-active {
    opacity: 0;
    bottom: -50%;
  }

  .align-items-center {
    align-items: center;
  }

</style>
