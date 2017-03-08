<template>
  <div class="section">
    <section class="container">
      <h1 class="title" v-show="username">Hi {{ username }}</h1>
    </section>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { getTeamById } from '../utils';

  export default {
    name: 'user-view',
    computed: {
      ...mapGetters([
        'currentUser',
      ]),
      username() {
        const user = getTeamById(this.currentUser.uid);

        if (user) {
          return user.displayName || user.email;
        }

        return '';
      },
    },
  };
</script>

<style>

</style>
