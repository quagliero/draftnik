<template>
  <div class="section">
    <section class="container">
      <h1 class="title" v-if="currentUser">Hi {{ currentUser.displayName }}</h1>
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
