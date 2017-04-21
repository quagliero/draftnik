<template>
  <div v-if="currentTrade">
    <trade-offer
      v-if="tradeStatus === TradeStatus.OFFERED"
      :trade="currentTrade"
    />
    <trade-rejected
      v-if="tradeStatus === TradeStatus.REJECTED"
      :trade="currentTrade"
    />
    <trade-withdrawn
      v-if="tradeStatus === TradeStatus.WITHDRAWN"
      :trade="currentTrade"
    />
    <trade-accepted
      v-if="tradeStatus === TradeStatus.ACCEPTED"
      :trade="currentTrade"
    />
  </div>
  <div v-else>
    <span class="icon">
      <i class="fa fa-spin fa-spinner"></i>
    </span>
    Fetching trade details...
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import TradeOffer from '../Trade/Offer.vue';
  import TradeRejected from '../Trade/Rejected.vue';
  import TradeWithdrawn from '../Trade/Withdrawn.vue';
  import TradeAccepted from '../Trade/Accepted.vue';
  import { TradeStatus } from '../../constants';

  export default {
    name: 'trade-view',
    props: ['id'],
    components: {
      TradeOffer,
      TradeRejected,
      TradeWithdrawn,
      TradeAccepted,
    },
    data() {
      return {
        TradeStatus,
      };
    },
    computed: {
      ...mapGetters([
        'currentDraft',
        'currentUser',
        'getTradeById',
      ]),
      currentTrade() {
        return this.getTradeById(this.id);
      },
      tradeStatus() {
        if (this.currentTrade) {
          return TradeStatus[this.currentTrade.status];
        }

        return TradeStatus[this.currentTrade.status] || TradeStatus.OFFERED;
      },
    },
    created() {
      this.$store.dispatch('getDrafts').then(() => {
        this.$store.dispatch('getUserTrades', {
          draft: this.currentDraft.id,
          user: this.currentUser.id,
        });
      });
    },
  };
</script>

<style lang="scss">

</style>
