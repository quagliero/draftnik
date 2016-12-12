<template>
  <section class="section">
    <div class="board container">
      <h1 class="title" v-if="draft">{{ draft.name }}</h1>
      <h1 class="title" v-else><i class="fa fa-spinner fa-spin"></i></h1>
      <section v-if="draft">
        <div class="columns is-mobile is-gapless is-multiline">
          <div class="column" v-for="team in teams">
            <team :team="team"></team>
          </div>
        </div>
      </section>
      <section v-if="draft">
        <round v-for="(round, key) in picksByRound" :round="round"></round>
      </section>
    </div>
  </section>
</template>

<script>
import Round from './Round.vue';
import Team from './Team.vue';
import roundPicksMap from '../../utils/utils';

export default {
  name: 'draft-board',
  components: {
    Team,
    Round,
  },
  data() {
    return {
      title: 'The Draft Board',
    };
  },
  computed: {
    draft() {
      return this.$store.getters.currentDraft;
    },
    teams() {
      return this.draft.users;
    },
    picksByRound() {
      return roundPicksMap(this.draft.rounds, this.draft.picks);
    },
  },
  methods: {
    highlightManagerPicks(managerId) {
      return this.draft.picks.filter(a => Number(a.user_id) === Number(managerId));
    },
  },
  created() {
    this.$store.dispatch('getAllDrafts');
  },
  ready() {
    this.picks = this.draft.picks;
  },
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

.board {
  margin-top: 2rem;
  .columns {
    margin-bottom: 1rem;
  }
  .columns:nth-child(even) {
    flex-direction: row-reverse;
  }
}

</style>
