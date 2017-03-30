<template>
  <div class="section">
    <section class="container">
      <h1 class="title" v-if="currentUser">{{ currentUser.teamName }}</h1>
      <br />
      <div class="columns">
        <div class="column">
          <my-picks
            :picks="myPicks"
            @onPickClick="$emit('onPickClick')"
          />
        </div>
        <div class="column">
          <my-watchlist
            @onPickClick="$emit('onPickClick')"
          />
        </div>
        <div class="column">
          <div class="panel">
            <p class="panel-heading">My Trades</p>
            <div class="panel-block">
              <ul>
                <li v-for="trade in userTrades">
                  <i class="fa fa-arrow-right"></i>
                  {{ getTeamById(trade.receivingTeam).displayName }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import MyPicks from '../components/User/MyPicks.vue';
  import MyWatchlist from '../components/User/MyWatchlist.vue';
  import { getTeamById } from '../utils';

  export default {
    name: 'user-view',
    components: {
      MyPicks,
      MyWatchlist,
    },
    computed: {
      ...mapGetters([
        'currentUser',
        'picksByTeam',
        'userTrades',
      ]),
      myPicks() {
        return this.picksByTeam(this.currentUser.id);
      },
    },
    created() {
      this.$store.dispatch('getUserTrades');
    },
    methods: {
      getTeamById(id) {
        return getTeamById(id);
      },
    },
  };
</script>

<style>

</style>
