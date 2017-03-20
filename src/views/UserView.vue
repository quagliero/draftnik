<template>
  <div class="section">
    <section class="container">
      <h1 class="title" v-if="currentUser">{{ currentUser.teamName }}</h1>
      <br />
      <div class="columns">
        <div class="column">
          <my-picks
            :picks="myPicks"
          />
        </div>
        <div class="column">
          <my-watchlist/>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import MyPicks from '../components/User/MyPicks.vue';
  import MyWatchlist from '../components/User/MyWatchlist.vue';

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
      ]),
      myPicks() {
        return this.picksByTeam(this.currentUser.id);
      },
    },
    created() {
      this.$store.dispatch('getDrafts');
    },
  };
</script>

<style>

</style>
