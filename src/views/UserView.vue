<template>
  <div class="section">
    <section class="container">
      <h1 class="title" v-if="currentUser">{{ currentUser.teamName }}</h1>
      <br />
      <div class="columns">
        <div class="column">
          <my-picks
            @onPickClick="$emit('onPickClick')"
          />
        </div>
        <div class="column">
          <my-watchlist
            @onPickClick="$emit('onPickClick')"
          />
        </div>
        <div class="column">
          <my-trades/>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import MyPicks from '../components/User/MyPicks.vue';
  import MyWatchlist from '../components/User/MyWatchlist.vue';
  import MyTrades from '../components/User/MyTrades.vue';

  export default {
    name: 'user-view',
    components: {
      MyPicks,
      MyWatchlist,
      MyTrades,
    },
    computed: {
      ...mapGetters([
        'currentUser',
      ]),
    },
  };
</script>

<style>

</style>
