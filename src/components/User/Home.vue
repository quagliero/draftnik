<template>
  <div class="columns">
    <div class="column">
      <my-picks/>
    </div>
    <div class="column">
      <my-trades/>
    </div>
    <div class="column">
      <my-watchlist/>
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
