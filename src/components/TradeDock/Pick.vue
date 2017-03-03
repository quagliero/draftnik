<template>
  <span @click="$emit('click', pick)">
    {{pick.round}}.{{pick.pickInRound}} (#{{pick.overall}})
  </span>
</template>

<script>
  export default {
    name: 'trade-dock-pick',
    props: ['pick'],
  };
</script>

<style scoped lang="scss">
  span {
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
</style>
