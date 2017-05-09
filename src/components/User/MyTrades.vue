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
    <template v-if="userTrades && expanded">
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
    </template>
    <template v-if="userTrades && !expanded">
      <p class="panel-tabs">
        <a @click.prevent="toggleExpanded()">
          <i class="fa fa-angle-double-down"></i>
          Show
          <i class="fa fa-angle-double-down"></i>
        </a>
      </p>
    </template>
    <template v-if="!userTrades && expanded">
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
