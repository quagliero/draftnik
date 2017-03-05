<template>
  <nav class="nav-menu">
    <router-link to="/board" class="nav-item is-tab">Board</router-link>
    <router-link to="/me" class="nav-item is-tab">My Draft</router-link>
    <!-- <router-link to="/trades" class="nav-item is-tab">Trades</router-link> -->
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
  data() {
    return {

    };
  },
  computed: {
    ...mapGetters([
      'authenticated',
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
