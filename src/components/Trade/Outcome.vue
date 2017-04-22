<template>
  <div class="columns">
    <div class="column has-text-centered">
      <div>
        <div :class="['notification', status]">
          <span class="title is-5">{{ notification }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'trade-outcome',
    props: ['status', 'notification'],
  };
</script>

<style lang="scss" scoped>
  .notification {
    padding-left: 0;
    padding-right: 0;
  }
</style>
