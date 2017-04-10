<template>
  <div id="app">
    <site-header/>
    <router-view/>
    <trade-dock/>
    <pick-modal/>
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
    // first off, fetch the teams
    // then trigger authentication checks and pull in required data
    this.$store.dispatch('getUsers').then(() => {
      this.$store.dispatch('checkAuth');
      this.$store.dispatch('getPlayers');
      this.$store.dispatch('getDrafts');
      this.$store.dispatch('getPickValuesBayesian');
      this.$store.dispatch('getAdp');
    });
  },
};
</script>

<style lang="scss">
@import "~bulma/utilities/_all";
@import "~bulma/base/minireset";
@import "~bulma/base/generic";
@import "~bulma/base/helpers";
@import "~bulma/grid/columns";
@import "~bulma/layout/section";
@import "~bulma/elements/button";
@import "~bulma/elements/box";
@import "~bulma/elements/title";
@import "~bulma/elements/icon";
@import "~bulma/elements/content";
@import "~bulma/elements/form";
@import "~bulma/elements/notification";
@import "~bulma/elements/other";
@import "~bulma/components/nav";
@import "~bulma/components/panel";
@import "~bulma/components/level";

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $text;
}

</style>
