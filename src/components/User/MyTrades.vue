<template>
  <div class="panel">
    <p class="panel-heading">Trades</p>
    <p class="panel-tabs">
      <a
        v-for="filter in tradeFilters"
        @click="filterTradesBy(filter)"
        :class="{ 'is-active' : selectedTradeFilter === filter }"
      >
        {{ filter }}
      </a>
    </p>
    <trade-panel
      v-for="trade in filteredTradees"
      :trade="trade"
      :currentUser="currentUser"
      :key="trade.id"
    />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import filter from 'lodash/filter';
  import TradePanel from './MyTrades/TradePanel.vue';

  export default {
    name: 'my-trades',
    components: {
      TradePanel,
    },
    data() {
      return {
        tradeFilters: ['All', 'Offered', 'Received', 'Accepted', 'Rejected'],
        selectedTradeFilter: 'All',
      };
    },
    computed: {
      ...mapGetters([
        'currentDraft',
        'currentUser',
        'userTrades',
      ]),
      filteredTradees() {
        return this.filterTradesBy(this.selectedTradeFilter);
      },
    },
    methods: {
      filterTradesBy(option) {
        this.selectedTradeFilter = option;

        if (option === 'Offered') {
          return filter(this.userTrades, (t) => t.givingTeam === this.currentUser.id);
        }

        if (option === 'Received') {
          return filter(this.userTrades, (t) => t.receivingTeam === this.currentUser.id);
        }

        if (option === 'Accepted') {
          return filter(this.userTrades, (t) => t.isAccepted === true);
        }

        if (option === 'Rejected') {
          return filter(this.userTrades, (t) => t.isRejected === true);
        }

        return this.userTrades;
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
