<template>
  <div class="panel">
    <p class="panel-heading">
      Trades
      <button
        class="button is-small pull-right"
        @click="toggleExpanded()"
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
    <template v-if="receivedUserTrades && expanded">
      <p class="panel-tabs">
        <a
          v-for="filter in tradeFilters"
          @click="selectedTradeFilter = filter"
          :class="{ 'is-active' : selectedTradeFilter === filter }"
        >
          {{ filter }}
        </a>
      </p>
      <trade-panel
        v-for="trade in filteredTrades"
        :trade="trade"
        :currentUser="currentUser"
        :key="trade.id"
      />
      <p
        v-show="filteredTrades.length === 0"
        class="panel-block"
      >
        <em>{{ displayEmptyFilterMessage(selectedTradeFilter) }}</em>
      </p>
    </template>
    <template v-if="!expanded">
      <p class="panel-tabs">
        <a @click.prevent="toggleExpanded()">
          <i class="fa fa-angle-double-down"></i>
          Show
          <i class="fa fa-angle-double-down"></i>
        </a>
      </p>
    </template>
    <template v-if="!receivedUserTrades && expanded">
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
  import { mapGetters, mapMutations } from 'vuex';
  import filter from 'lodash/filter';
  import TradePanel from './MyTrades/TradePanel.vue';
  import { TradeStatus } from '../../constants';
  import { CHANGE_USER_PREF } from '../../store/mutations';

  export default {
    name: 'my-trades',
    components: {
      TradePanel,
    },
    data() {
      return {
        tradeFilters: ['All', 'Open', 'Accepted', 'Rejected'],
        selectedTradeFilter: 'Open',
      };
    },
    computed: {
      ...mapGetters([
        'currentDraft',
        'currentUser',
        'userTrades',
        'receivedUserTrades',
        'userPrefs',
      ]),
      expanded() {
        return this.userPrefs.showTrades;
      },
      filteredTrades() {
        return this.filterTradesBy(this.selectedTradeFilter);
      },
    },
    methods: {
      ...mapMutations({
        CHANGE_USER_PREF,
      }),
      toggleExpanded() {
        this.CHANGE_USER_PREF({
          pref: 'showTrades',
          value: !this.expanded,
        });
      },
      filterTradesBy(option) {
        this.selectedTradeFilter = option;

        switch (option) {
          case 'All':
            return filter(this.userTrades);
          case 'Open':
            return filter(this.userTrades, (t) => t.status === TradeStatus.OFFERED);
          case 'Accepted':
            return filter(this.userTrades, (t) => t.status === TradeStatus.ACCEPTED);
          case 'Rejected':
            return filter(
              this.userTrades,
              (t) => t.status === TradeStatus.REJECTED || t.status === TradeStatus.WITHDRAWN,
            );
          default:
            return filter(this.userTrades);
        }
      },
      displayEmptyFilterMessage(filterName) {
        const type = filterName.toLowerCase();

        if (type === 'all') {
          return 'You have no desire to win, it seems. Make some trades.';
        }

        return `You have no ${type} trades`;
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
