<template>
  <div>
    <span class="nav-toggle" @click="isOpen = !isOpen">
      <span></span>
      <span></span>
      <span></span>
    </span>
    <nav
      class="nav-right nav-menu"
      :class="{ 'is-active': isOpen}"
      @click="isOpen = !isOpen"
    >
      <router-link :to="{ name: 'board' }" class="nav-item is-tab">Board</router-link>
      <router-link :to="{ name: 'me' }" class="nav-item is-tab">War Room</router-link>
      <router-link :to="{ name: 'trades' }" class="nav-item is-tab">
        <span class="icon is-small" style="margin-right: 0.5rem;">
          <i class="fa fa-handshake-o"></i>
        </span>
        <span>Done Deals</span>
      </router-link>
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'site-nav',
  data() {
    return {
      isOpen: false,
    };
  },
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
  .nav-menu.is-active {
    z-index: 100;
  }
</style>
