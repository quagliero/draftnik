<template>
  <div class="section">
    <section class="container">
      <h1 class="title">Accepted Trades</h1>
      <ul class="panel">
        <li class="panel-block" v-for="trade in acceptedTrades">
          <div class="level is-mobile">
            <div class="column is-4 has-text-centered">
              <strong>{{ getUserById(trade.givingTeam).teamName }}</strong>
              <ul>
                <li v-for="(value, pick) in trade.givingPicks">
                  #{{ getPickById(pick).overall }}
                </li>
              </ul>
            </div>
            <div class="column is-4 has-text-centered">
              <i class="fa fa-exchange"></i>
            </div>
            <div class="column is-4 has-text-centered">
              <strong>{{ getUserById(trade.receivingTeam).teamName }}</strong>
              <ul>
                <li v-for="(value, pick) in trade.receivingPicks">
                  #{{ getPickById(pick).overall }}
                </li>
              </ul>
            </div>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'trades-view',
    computed: {
      ...mapGetters([
        'currentDraft',
        'acceptedTrades',
        'getUserById',
        'getPickById',
      ]),
    },
    created() {
      this.$store.dispatch('getDrafts').then(() => {
        this.$store.dispatch('getAcceptedTrades', {
          draft: this.currentDraft.id,
        });
      });
    },
  };
</script>

<style lang="scss" scoped>
  .level {
    width: 100%;
  }
</style>
