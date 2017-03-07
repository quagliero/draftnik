<template>
  <div class="section">
    <section class="container">
      <h1 class="title">Hi admin {{ currentUser.email }}</h1>
    </section>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'admin-view',
    computed: {
      ...mapGetters([
        'currentUser',
      ]),
    },
  };
</script>

<style>

</style>
