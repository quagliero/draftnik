<template>
  <div class="panel">
    <p class="panel-heading">
      Trades
      <button
        class="button is-small pull-right"
        @click="expanded = !expanded"
      >
        <span class="icon">
          <i
            :class="['fa', {
              'fa-arrow-circle-up': expanded === true,
              'fa-arrow-circle-down': expanded === false,
            }]">
          </i>
        </span>
      </button>
    </p>
    <p class="panel-tabs">
      <a
        v-for="filter in tradeFilters"
        @click="filterTradesBy(filter)"
        :class="{ 'is-active' : selectedTradeFilter === filter }"
      >
        {{ filter }}
      </a>
    </p>
    <template v-if="userTrades">
      <trade-panel
        v-if="expanded"
        v-for="trade in filteredTrades"
        :trade="trade"
        :currentUser="currentUser"
        :key="trade.id"
      />
    </template>
    <template v-else>
      <div class="panel-block">
        <span>Fetching trades </span>
        <span class="icon">
          <i class="fa fa-spinner fa-spin"></i>
        </span>
      </div>
    </template>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import filter from 'lodash/filter';
  import TradePanel from './MyTrades/TradePanel.vue';
  import { TradeStatus } from '../../constants';

  export default {
    name: 'my-trades',
    components: {
      TradePanel,
    },
    data() {
      return {
        expanded: true,
        tradeFilters: ['All', 'Open', 'Accepted', 'Rejected'],
        selectedTradeFilter: 'Open',
      };
    },
    computed: {
      ...mapGetters([
        'currentDraft',
        'currentUser',
        'userTrades',
      ]),
      filteredTrades() {
        return this.filterTradesBy(this.selectedTradeFilter);
      },
    },
    methods: {
      filterTradesBy(option) {
        this.selectedTradeFilter = option;

        if (option === 'Open') {
          return filter(this.userTrades, (t) => t.status === TradeStatus.OFFERED);
        }

        if (option === 'Accepted') {
          return filter(this.userTrades, (t) => t.status === TradeStatus.ACCEPTED);
        }

        if (option === 'Rejected') {
          return filter(
            this.userTrades,
            (t) => t.status === TradeStatus.REJECTED || t.status === TradeStatus.WITHDRAWN,
          );
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
