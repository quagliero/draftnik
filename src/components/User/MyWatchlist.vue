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
        v-for="pos in watchlistFilters"
        @click="filterWatchlistBy(pos)"
        :class="{ 'is-active' : selectedWatchlistFilter === pos }"
      >
        {{ pos }}
      </a>
    </p>
    <div
      v-for="player in filteredWatchlist"
      v-if="filteredWatchlist.length"
      class="panel-block"
    >
      <div class="level">
        <div class="level-left">
          <button
            class="button is-white"
            @click="onPlayerClick(player)"
          >
            <span class="panel-icon">
              <i class="fa fa-vcard-o"></i>
            </span>
            {{ player.name }} {{ player.position }}
          </button>
        </div>
        <div class="level-right">
          <!-- @click="addToWatchlistClick(player)" -->
          <button
            class="button is-small is-danger"
            @click="removeFromWatchlistClick(player)"
          >
            <span class="icon is-small">
              <i class="fa fa-remove"></i>
            </span>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
  import { mapGetters, mapActions, mapMutations } from 'vuex';
  import filter from 'lodash/filter';
  import map from 'lodash/map';
  import keys from 'lodash/keys';
  import findIndex from 'lodash/findIndex';
  import { SELECT_PICK } from '../../store/mutations';

  export default {
    name: 'my-watchlist',
    data() {
      return {
        // filteredPicks: this.computedFilteredPicks,
        watchlistFilters: ['All', 'RB', 'WR', 'QB', 'TE'],
        selectedWatchlistFilter: 'All',
      };
    },
    computed: {
      ...mapGetters([
        'players',
        'adp',
        'watchlist',
        'picksArray',
      ]),
      filteredWatchlist() {
        return this.filterWatchlistBy(this.selectedWatchlistFilter);
      },
      watchlistPlayers() {
        return map(keys(this.watchlist), pid => this.players[pid]);
      },
    },
    methods: {
      ...mapActions([
        'addToWatchlist',
        'removeFromWatchlist',
      ]),
      ...mapMutations({
        SELECT_PICK,
      }),
      filterWatchlistBy(pos) {
        this.selectedWatchlistFilter = pos;

        if (pos === 'All') {
          return this.watchlistPlayers;
        }

        return filter(this.watchlistPlayers, (p) => p.position === pos);
      },
      addToWatchlistClick(player) {
        this.addToWatchlist(player);
      },
      removeFromWatchlistClick(player) {
        this.removeFromWatchlist(player);
      },
      onPlayerClick(player) {
        const adpSlot = findIndex(this.adp, (pick) => pick.id === player.id);
        let pick;
        // due to the nature of more players than picks, if the adp is above
        // the max pick count, then just return the last pick in the draft
        if (adpSlot <= this.picksArray.length) {
          pick = this.picksArray[adpSlot];
        } else {
          pick = this.picksArray[this.picksArray.length - 1];
        }

        this.SELECT_PICK({ pick });
        this.$emit('onPickClick', pick);
      },
    },
    created() {
      this.$store.dispatch('getWatchlist');
    },
  };
</script>

<style scoped>
  .level {
    width: 100%;
  }
</style>
