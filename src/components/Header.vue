<template>
  <div class="container">
    <header class="nav">
      <div class="nav-left">
        <router-link
          class="nav-item"
          style="padding-left: 0"
          to="/"
          exact
        >
          <logo class="is-brand"/>
        </router-link>
      </div>
      <site-nav/>
    </header>
  </div>
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
