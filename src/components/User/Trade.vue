<template>
  <div>
    <trade-offer
      v-if="tradeStatus === TradeStatus.OFFERED"
      :trade="currentTrade"
    />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import TradeOffer from '../Trade/Offer.vue';
  import { TradeStatus } from '../../constants';

  export default {
    name: 'trade-view',
    props: ['id'],
    components: {
      TradeOffer,
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
        return TradeStatus[this.currentTrade] || TradeStatus.OFFERED;
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
