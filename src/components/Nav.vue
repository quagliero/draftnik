<template>
  <nav class="nav-menu">
    <router-link to="/board" class="nav-item is-tab">Board</router-link>
    <router-link to="/me" class="nav-item is-tab">My Draft</router-link>
    <router-link to="/trades" class="nav-item is-tab">Trades</router-link>
  </nav>
</template>

<script>
export default {
  name: 'site-nav',
  data() {
    return {

    };
  },
};
</script>

<style lang="scss">

</style>
