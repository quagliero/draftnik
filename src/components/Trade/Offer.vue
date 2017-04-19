<template>
  <article class="panel">
    <h3 class="title is-3">
      <span class="icon is-medium">
        <i :class="['fa', userProposed ? 'fa-arrow-right' : 'fa-arrow-left']"></i>
      </span>
      Trade offer {{ userProposed ? 'to' : 'from' }} {{ otherTeam.displayName }}
    </h3>
    <br/>
    <div class="columns is-mobile has-text-centered">
      <div class="column">
        <h4 class="title is-4">You give</h4>
        <ul>
          <li v-for="pick in givingPicks" style="margin-bottom: 0.5rem;">
            <span class="title is-5">
              {{ pick.round }}.{{ pick.pickInRound }} (#{{ pick.overall }})
            </span>
          </li>
        </ul>
      </div>
      <div class="column">
        <div class="icon is-large">
          <i class="fa fa-exchange"/>
        </div>
      </div>
      <div class="column">
        <h4 class="title is-4">You get</h4>
        <ul>
          <li v-for="pick in receivingPicks" style="margin-bottom: 0.5rem;">
            <span class="title is-5">
              {{ pick.round }}.{{ pick.pickInRound }} (#{{ pick.overall }})
            </span>
          </li>
        </ul>
      </div>
    </div>
    <div class="columns">
      <div class="column has-text-centered">
        <template v-if="trade.status === TradeStatus.OFFERED">
          <div v-if="userProposed === false">
            <button
              @click="handleRejectTrade"
              class="button is-large is-danger"
            >
              <span class="icon is-medium">
                <i class="fa fa-remove"></i>
              </span>
              <span>Reject</span>
            </button>
            <span class="spacer"></span>
            <button
              @click="handleAcceptTrade"
              class="button is-large is-success"
            >
              <span class="icon is-medium">
                <i class="fa fa-handshake-o"></i>
              </span>
              <span>Accept</span>
            </button>
          </div>
          <div v-if="userProposed === true">
            <button
              @click="handleWithdrawTrade"
              class="button is-large is-danger"
            >
              <span class="icon is-medium">
                <i class="fa fa-remove"></i>
              </span>
              <span>Withdraw Offer</span>
            </button>
          </div>
        </template>
        <div v-if="trade.status === TradeStatus.REJECTED">
          <div class="notification is-danger">
            <span class="title is-5">This offer was rejected</span>
          </div>
        </div>
        <div v-if="trade.status === TradeStatus.WITHDRAWN">
          <div class="notification is-danger">
            <span class="title is-5">This offer was withdrawn</span>
          </div>
        </div>
        <div v-if="trade.status === TradeStatus.ACCEPTED">
          <div class="notification is-success">
            <span class="title is-5">This trade was accepted</span>
          </div>
        </div>
      </div>
    </div>
    <hr/>
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
  </article>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import map from 'lodash/map';
  import keys from 'lodash/keys';
  import {
    getTeamById,
    calculateDoddsTradeValue,
    calculateBayesianTradeValue,
  } from '../../utils';
  import { TradeStatus } from '../../constants';

  export default {
    name: 'trade-offer',
    props: ['trade'],
    data() {
      return {
        TradeStatus,
      };
    },
    computed: {
      ...mapGetters([
        'currentUser',
        'currentDraft',
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
      userCanRespond() {
        return this.trade.status === TradeStatus.OFFERED && this.userProposed === false;
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
    methods: {
      ...mapActions([
        'rejectTrade',
        'withdrawTrade',
        'acceptTrade',
      ]),
      handleRejectTrade() {
        this.rejectTrade({
          draft: this.currentDraft.id,
          trade: this.trade.id,
        });
      },
      handleWithdrawTrade() {
        this.withdrawTrade({
          draft: this.currentDraft.id,
          trade: this.trade.id,
        });
      },
      handleAcceptTrade() {
        this.acceptTrade({
          draft: this.currentDraft.id,
          trade: this.trade.id,
          givingTeam: this.trade.givingTeam,
          givingPicks: this.trade.givingPicks,
          receivingTeam: this.trade.receivingTeam,
          receivingPicks: this.trade.receivingPicks,
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .notification {
    padding-left: 0;
    padding-right: 0;
  }
  .spacer {
    display: inline-block;
    margin-left: 1rem;
    margin-right: 1rem;
  }
</style>
