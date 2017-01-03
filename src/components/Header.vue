<template>
  <header class="nav">
    <div class="container">
      <span class="nav-left">
        <router-link to="/" exact><logo class="nav-item is-brand"></logo></router-link>
      </span>
      <site-nav class="nav-right"></site-nav>
    </div>
  </header>
</template>

<script>
import Logo from './Logo.vue';
import SiteNav from './Nav.vue';

export default {
  name: 'site-header',
  components: {
    Logo,
    SiteNav,
  },
  data() {
    return {
      title: 'boo',
    };
  },
};
</script>

<style lang="scss">

</style>
