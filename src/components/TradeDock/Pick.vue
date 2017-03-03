<template>
  <span @click="$emit('click', pick)">
    {{pick.round}}.{{pick.pickInRound}} (#{{pick.overall}})<slot></slot>
  </span>
</template>

<script>
  export default {
    name: 'trade-dock-pick',
    props: ['pick', 'isLast'],
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
