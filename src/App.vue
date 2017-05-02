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
      this.$store.dispatch('getPlayersAndAdp');
      this.$store.dispatch('getDrafts');
      this.$store.dispatch('getPickValuesBayesian');
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
@import "~bulma/elements/tag";
@import "~bulma/elements/form";
@import "~bulma/elements/notification";
@import "~bulma/elements/other";
@import "~bulma/components/nav";
@import "~bulma/components/panel";
@import "~bulma/components/level";
@import "~bulma/components/message";
@import "~bulma/components/media";

#app {
  -webkit-font-smoothing: antialiased;
  -webkit-font-smoothing: subpixel-antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $text;
  padding-bottom: 100px;
}

.button .icon {
  vertical-align: middle;
}

.button .icon + span {
  vertical-align: middle;
}

</style>
