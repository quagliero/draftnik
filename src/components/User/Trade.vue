<template>
  <div>
    <h3>Trade {{ id }}</h3>
    <h4>{{ currentTrade }}</h4>
    <hr/>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'trade-view',
    props: ['id'],
    computed: {
      ...mapGetters([
        'currentDraft',
        'currentUser',
        'getTradeById',
      ]),
      currentTrade() {
        return this.getTradeById(this.id);
      },
    },
    created() {
      this.$store.dispatch('getDrafts').then(() => {
        this.$store.dispatch('getUserTrades', {
          draft: this.currentDraft.id,
          user: this.currentUser.id,
        });
      });
    },
  };
</script>

<style lang="scss">

</style>
