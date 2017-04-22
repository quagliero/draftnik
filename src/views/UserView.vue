<template>
  <div class="section">
    <section class="container">
      <h1 class="title">War Room</h1>
      <h2 class="subtitle" v-if="currentUser">{{ currentUser.teamName }}</h2>
      <br />
      <router-view/>
    </section>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'user-view',
    computed: {
      ...mapGetters([
        'currentUser',
      ]),
    },
  };
</script>

<style>

</style>
