<template>
  <nav class="panel">
    <p class="panel-heading">
      My Watchlist
    </p>
    <!-- <div class="panel-block">
      <p class="control has-icon">
        <input class="input is-small" type="text" placeholder="Search">
        <span class="icon is-small">
          <i class="fa fa-search"></i>
        </span>
      </p>
    </div> -->
    <p class="panel-tabs">
      <a
        v-for="pos in playerFilters"
        @click="filterPlayerBy(pos)"
        :class="{ 'is-active' : selectedPlayerFilter === pos }"
      >
        {{ pos }}
      </a>
    </p>
    <a
      v-for="player in filteredPlayers"
      v-if="filteredPlayers.length"
      class="panel-block"
    >
      <span class="panel-icon">
        <i class="fa fa-book"></i>
      </span>
      {{ player.name }} {{ player.position }}
    </a>
    <!-- <a
      v-for="pick in filteredPicks"
      v-if="filteredPicks !== null"
      class="panel-block"
    >
      <span class="panel-icon">
        <i class="fa fa-chevron-right"></i>
      </span>
      #{{ pick.overall }} - {{ pick.round }}.{{ pick.pickInRound }}
    </a> -->
    <!-- <div class="panel-block">
      <button class="button is-primary is-outlined is-fullwidth">
        Reset all filters
      </button>
    </div> -->
  </nav>
</template>

<script>
  import { mapGetters } from 'vuex';
  import filter from 'lodash/filter';

  export default {
    name: 'my-watchlist',
    data() {
      return {
        // filteredPicks: this.computedFilteredPicks,
        playerFilters: ['All', 'RB', 'WR', 'QB', 'TE'],
        selectedPlayerFilter: 'All',
      };
    },
    computed: {
      ...mapGetters([
        'players',
      ]),
      filteredPlayers() {
        return this.filterPlayerBy(this.selectedPlayerFilter);
      },
    },
    methods: {
      filterPlayerBy(pos) {
        this.selectedPlayerFilter = pos;
        if (pos === 'All') {
          return this.players;
        }

        return filter(this.players, (p) => p.position === pos);
      },
    },
  };
</script>
