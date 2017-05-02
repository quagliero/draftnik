<template>
  <div>
    <div
      v-if="trade.message"
      class="message is-light trade-message"
    >
      <div class="message-body">
        <div class="media" >
          <div class="media-left">
            <span class="icon is-medium">
              <i class="fa fa-comment"></i>
            </span>
          </div>
          <div class="media-content">
            <p>{{ trade.message }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="trade-details">
      <div class="columns is-mobile has-text-centered">
        <div class="column">
          <h4 class="title is-4">You {{ tense === 'past' ? 'gave' : 'give' }}</h4>
          <ul>
            <li v-for="pick in givingPicks" style="margin-bottom: 0.5rem;">
              <span class="title is-5">
                {{ pick.round }}.{{ pick.pickInRound }} (#{{ pick.overall }})
              </span>
            </li>
          </ul>
        </div>
        <div class="column">
          <div class="icon is-large">
            <i class="fa fa-exchange"/>
          </div>
        </div>
        <div class="column">
          <h4 class="title is-4">You {{ tense === 'past' ? 'got' : 'get' }}</h4>
          <ul>
            <li v-for="pick in receivingPicks" style="margin-bottom: 0.5rem;">
              <span class="title is-5">
                {{ pick.round }}.{{ pick.pickInRound }} (#{{ pick.overall }})
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
  import { mapGetters } from 'vuex';
  import map from 'lodash/map';
  import keys from 'lodash/keys';

  export default {
    name: 'trade-details',
    props: ['trade', 'tense'],
    computed: {
      ...mapGetters([
        'currentUser',
        'getPickById',
      ]),
      givingPicks() {
        const picks = (this.userProposed) ? this.trade.givingPicks : this.trade.receivingPicks;
        return map(keys(picks), pick => this.getPickById(pick));
      },
      receivingPicks() {
        const picks = (this.userProposed) ? this.trade.receivingPicks : this.trade.givingPicks;
        return map(keys(picks), pick => this.getPickById(pick));
      },
      userProposed() {
        return (this.trade.givingTeam === this.currentUser.id);
      },
    },
  };
</script>

<style>
  .trade-message {
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .trade-details {
    margin-top: 3rem;
    margin-bottom: 1.5rem;
  }
</style>
