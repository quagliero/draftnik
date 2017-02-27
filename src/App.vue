<template>
  <div id="app">
    <site-header></site-header>
    <router-view></router-view>
    <trade-dock></trade-dock>
  </div>
</template>

<script>
import SiteHeader from './components/Header.vue';
import TradeDock from './components/TradeDock.vue';

export default {
  name: 'app',
  components: {
    SiteHeader,
    TradeDock,
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
