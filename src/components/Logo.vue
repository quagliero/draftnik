<template>
  <span class="logo">
    <span class="logo__icon">🏈</span>
    <span class="logo__text">draftnik <small>(pre-alpha)</small></span>
  </span>
</template>

<script>
export default {
  name: 'logo',
  data() {
    return {
      size: '',
    };
  },
};
</script>

<style lang="scss" scoped>
.logo {
  color: #2c3e50;
  will-change: color;
  transition: .2s color ease;
  display: inline-block;
  line-height: 1.5;

  &:hover, &:focus {
    color: #00d1b2;
  }
}

.logo__icon {
  padding-left: 0.3rem;
  display: inline-block;
  font-weight: 900;
  font-size: 2rem;
  vertical-align: middle;
  text-shadow:
   -0.15em -0.15em 0 #42b983,
   0.15em -0.15em 0 #5c9079,
   -0.15em 0.15em 0 #88deb7,
   0.15em 0.15em 0 #7cb39a;
}

.logo__text {
  display: inline-block;
  vertical-align: middle;
  font-weight: 500;
  font-size: 1.2rem;
  padding-left: 0.5rem;
}
</style>
