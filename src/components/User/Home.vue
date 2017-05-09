<template>
  <div class="columns is-multiline">
    <div class="column is-4-desktop is-half-tablet my-picks">
      <my-picks/>
    </div>
    <div class="column is-4-desktop is-half-tablet my-watchlist">
      <my-watchlist/>
    </div>
    <div class="column is-4-desktop is-12-tablet my-trades">
      <my-trades/>
    </div>
  </div>
</template>

<script>
import MyPicks from './MyPicks.vue';
import MyWatchlist from './MyWatchlist.vue';
import MyTrades from './MyTrades.vue';

export default {
  name: 'user-home',
  components: {
    MyPicks,
    MyWatchlist,
    MyTrades,
  },
};
</script>

<style lang="scss">
@import "~bulma/utilities/variables";
  @media screen and (max-width: $desktop) {
    .my-trades {
      order: 1 !important;
    }

    .my-picks {
      order: 2 !important;
    }

    .my-watchlist {
      order: 3 !important;
    }
  }
</style>
