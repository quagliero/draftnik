<template>
  <header class="nav">
    <div class="nav-left">
      <router-link to="/" exact><logo class="nav-item is-brand"></logo></router-link>
    </div>
    <site-nav/>
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
      isOpen: false,
    };
  },
};
</script>

<style lang="scss">

</style>
