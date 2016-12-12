<template>
  <div id="app">
    <site-header></site-header>
    <draft-board></draft-board>
  </div>
</template>

<script>
import SiteHeader from './components/Header.vue';
import DraftBoard from './components/DraftBoard/Board.vue';

export default {
  name: 'app',
  components: {
    SiteHeader,
    DraftBoard,
  },
};
</script>

<style lang="sass">
@import './node_modules/bulma/bulma.sass'

#app
  font-family: 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50


</style>
