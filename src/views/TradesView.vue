<template>
  <div class="section">
    <section class="container">
      <h1 class="title">Accepted Trades</h1>
      <ul class="panel has-text-centered">
        <li v-for="trade in acceptedTrades" style="margin-bottom: 1rem;">
          <div class="panel-heading">
            <div class="columns is-mobile">
              <div class="column is-5">
                <strong class="trades-team-name">{{ getUserById(trade.givingTeam).teamName }}</strong>
              </div>
              <div class="column is-2"></div>
              <div class="column is-5">
                <strong class="trades-team-name">{{ getUserById(trade.receivingTeam).teamName }}</strong>
              </div>
            </div>
          </div>
          <div class="panel-block">
            <div class="level is-mobile">
              <div class="column is-5">
                <ul>
                  <li v-for="(value, pick) in trade.givingPicks">
                    #{{ getPickById(pick).overall }}
                  </li>
                </ul>
              </div>
              <div class="column is-2">
                <i class="fa fa-exchange"></i>
              </div>
              <div class="column is-5">

                <ul>
                  <li v-for="(value, pick) in trade.receivingPicks">
                    #{{ getPickById(pick).overall }}
                  </li>
                </ul>
              </div>
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

  .trades-team-name {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
