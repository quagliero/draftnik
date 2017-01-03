<template>
  <div id="app">
    <site-header></site-header>
    <router-view></router-view>
  </div>
</template>

<script>
import SiteHeader from './components/Header.vue';

export default {
  name: 'app',
  components: {
    SiteHeader,
  },
};
</script>

<style lang="scss">
@import './node_modules/bulma/bulma';

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

</style>
