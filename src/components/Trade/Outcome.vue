<template>
  <div class="columns">
    <div class="column has-text-centered">
      <div>
        <div :class="['notification', status]">
          <span class="title is-5">{{ notification }} {{ prettyDate }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment';

  export default {
    name: 'trade-outcome',
    props: ['status', 'notification', 'date'],
    computed: {
      prettyDate() {
        if (this.date != null) {
          const pretty = moment(this.date).format('MMMM Do YYYY @ h:mma');
          return ` on ${pretty}`;
        }

        return '';
      },
    },
  };
</script>

<style lang="scss" scoped>
  .notification {
    padding-left: 0;
    padding-right: 0;
  }
</style>
