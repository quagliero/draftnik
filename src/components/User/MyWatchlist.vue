<template>
  <nav class="panel">
    <p class="panel-heading">
      Watchlist
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
    <template v-if="watchlistReceived && expanded">
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
        class="panel-block"
      >
        <div class="level is-mobile">
          <div class="level-left">
            <button
              class="button is-white"
              @click="onPlayerClick(player)"
            >
              <span class="panel-icon">
                <i class="fa fa-vcard-o"></i>
              </span>
              {{ player.name }} ({{ player.pos }})
            </button>
          </div>
          <div class="level-right">
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
    </template>
    <template v-if="watchlistReceived && !expanded">
      <div class="panel-tabs">
        <a @click.prevent="toggleExpanded()">
          <i class="fa fa-angle-double-down"></i>
          Show
          <i class="fa fa-angle-double-down"></i>
        </a>
      </div>
    </template>
    <template v-if="!watchlistReceived && expanded">
      <div class="panel-block">
        <span>Fetching watchlist </span>
        <span class="icon">
          <i class="fa fa-spinner fa-spin"></i>
        </span>
      </div>
    </template>
  </nav>
</template>

<script>
  import { mapGetters, mapActions, mapMutations } from 'vuex';
  import filter from 'lodash/filter';
  import map from 'lodash/map';
  import keys from 'lodash/keys';
  import findIndex from 'lodash/findIndex';
  import { SELECT_PICK, CHANGE_USER_PREF } from '../../store/mutations';

  export default {
    name: 'my-watchlist',
    data() {
      return {
        watchlistFilters: ['All', 'RB', 'WR', 'QB', 'TE'],
        selectedWatchlistFilter: 'All',
      };
    },
    computed: {
      ...mapGetters([
        'players',
        'adp',
        'watchlist',
        'watchlistReceived',
        'picksArray',
        'currentUser',
        'currentDraft',
        'userPrefs',
      ]),
      expanded() {
        return this.userPrefs.showWatchlist;
      },
      filteredWatchlist() {
        return this.filterWatchlistBy(this.selectedWatchlistFilter);
      },
      watchlistPlayers() {
        return filter(map(keys(this.watchlist), pid => this.players[pid]), p => p);
      },
    },
    methods: {
      ...mapActions([
        'addToWatchlist',
        'removeFromWatchlist',
      ]),
      ...mapMutations({
        SELECT_PICK,
        CHANGE_USER_PREF,
      }),
      toggleExpanded() {
        this.CHANGE_USER_PREF({
          pref: 'showWatchlist',
          value: !this.expanded,
        });
      },
      filterWatchlistBy(pos) {
        this.selectedWatchlistFilter = pos;

        if (pos === 'All') {
          return this.watchlistPlayers;
        }

        return filter(this.watchlistPlayers, (p) => p.pos === pos);
      },
      addToWatchlistClick(player) {
        this.addToWatchlist({
          player,
          draft: this.currentDraft.id,
          user: this.currentUser.id,
        });
      },
      removeFromWatchlistClick(player) {
        this.removeFromWatchlist({
          player,
          draft: this.currentDraft.id,
          user: this.currentUser.id,
        });
      },
      onPlayerClick(player) {
        const adpSlot = findIndex(this.adp, (pick) => pick.id === player.id);
        const max = this.picksArray.length;

        // due to the nature of more players than picks, if the adp is above
        // the max pick count, then just return the last pick in the draft
        let pick;
        if (adpSlot <= max) {
          pick = this.picksArray[adpSlot];
        } else {
          pick = this.picksArray[max - 1];
        }

        this.SELECT_PICK({ pick });
        this.$bus.$emit('pickModal.open');
      },
    },
    created() {
      this.$store.dispatch('getDrafts').then(() => {
        this.$store.dispatch('getWatchlist', {
          draft: this.currentDraft.id,
          user: this.currentUser.id,
        });
      });
    },
  };
</script>

<style scoped>
  .level {
    width: 100%;
  }
</style>
