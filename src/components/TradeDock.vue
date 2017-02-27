<template>
  <div v-if="hasTrade" class="trade-dock">
    <div class="container">
      <div class="level">
        <div class="level-left">
          <p>Trade Dock</p>
        </div>
        <div class="level-right">
          <button class="delete"></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'trade-dock',
    computed: {
      ...mapGetters([
        'tempTrade',
        'currentTrade',
      ]),
      hasTrade() {
        return this.tempTrade.id;
      },
    },
  };
</script>

<style lang="scss">
  @import '~bulma/variables';

  .trade-dock {
    padding-top: $size-7;
    padding-bottom: $size-7;
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: $dark;
    color: $light
  }

</style>
