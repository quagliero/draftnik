<template>
  <span class="logo">
    <span class="logo__icon">d</span>
    <span class="logo__text">draftnik</span>
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

  &:hover, &:focus {
    color: #00d1b2;
  }
}

.logo__icon {
  padding-left: 0.3rem;
  display: inline-block;
  font-weight: 900;
  font-size: 2rem;
  text-shadow:
   -0.3rem -0.3rem 0 #42b983,
   0.3rem -0.3rem 0 #5c9079,
   -0.3rem 0.3rem 0 #88deb7,
   0.3rem 0.3rem 0 #7cb39a;
}

.logo__text {
  display: inline-block;
  vertical-align: middle;
  font-weight: 500;
  font-size: 1.2rem;
  padding-left: 0.5rem;
}
</style>
