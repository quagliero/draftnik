<template>
  <div class="columns">
    <div class="column has-text-centered">
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
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  export default {
    name: 'trade-actions',
    props: ['trade'],
    computed: {
      ...mapGetters([
        'currentUser',
        'currentDraft',
      ]),
      userProposed() {
        return (this.trade.givingTeam === this.currentUser.id);
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
  .spacer {
    display: inline-block;
    margin-left: 1rem;
    margin-right: 1rem;
  }
</style>
