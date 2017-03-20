<template>
  <div id="app">
    <site-header></site-header>
    <router-view @onPickClick="showPickModal = true"></router-view>
    <trade-dock @onDockPickClick="showPickModal = true"></trade-dock>
    <transition name="fade">
      <pick-modal
        v-if="showPickModal"
        @close="showPickModal = false"
      />
    </transition>
  </div>
</template>

<script>
import SiteHeader from './components/Header.vue';
import TradeDock from './components/TradeDock.vue';
import PickModal from './components/Modals/PickModal.vue';

export default {
  name: 'app',
  data() {
    return {
      showPickModal: false,
    };
  },
  components: {
    SiteHeader,
    TradeDock,
    PickModal,
  },
  beforeCreate() {
    // first off, fetch the teams, then trigger authentication checks
    this.$store.dispatch('getUsers').then(() => {
      this.$store.dispatch('checkAuth');
      this.$store.dispatch('getDrafts');
    });
  },
};
</script>

<style lang="scss">
@import './node_modules/bulma/bulma';

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $text;
}

</style>
