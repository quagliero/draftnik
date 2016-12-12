<template>
  <nav class="nav-menu">
    <a href="/board" class="nav-item is-tab is-active">Board</a>
    <a class="nav-item is-tab" href="/picks">My Picks</a>
    <a class="nav-item is-tab" href="/trades">Trades</a>
  </nav>
</template>

<script>
export default {
  name: 'site-nav',
  data() {
    return {
      size: '',
    };
  },
};
</script>
