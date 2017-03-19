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
          <p class="title">My watchlist</p>
          <div class="content">
            <!-- Content -->
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import filter from 'lodash/filter';
  import MyPicks from '../components/User/MyPicks.vue';

  export default {
    name: 'user-view',
    components: {
      MyPicks,
    },
    computed: {
      ...mapGetters([
        'currentUser',
        'picks',
      ]),
      myPicks() {
        return filter(this.picks, (p) => p.team === this.currentUser.id);
      },
    },
    created() {
      this.$store.dispatch('getDrafts');
    },
  };
</script>

<style>

</style>
