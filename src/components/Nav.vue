<template>
  <nav class="nav-menu">
    <router-link :to="{ name: 'board' }" class="nav-item is-tab">Board</router-link>
    <router-link :to="{ name: 'me' }" class="nav-item is-tab">My Draft</router-link>
    <!-- <router-link to="/trades" class="nav-item is-tab">Trades</router-link> -->
    <router-link
      v-if="authenticated && isAdmin === true"
      :to="{ name: 'admin' }"
      class="nav-item is-tab"
    >
      Admin
    </router-link>
    <span class="nav-item">
      <button v-if="authenticated === true" class="button is-link" @click="onLogoutClick">
        <small>Logout</small>
      </button>
    </span>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'site-nav',
  computed: {
    ...mapGetters([
      'authenticated',
      'isAdmin',
    ]),
  },
  methods: {
    onLogoutClick() {
      this.$store.dispatch('logout');
    },
  },
};
</script>

<style lang="scss">

</style>
