<template>
  <section class="section">
    <div class="board container">
      <h1 class="title" v-if="currentDraft">{{ currentDraft.name }}</h1>
      <h1 class="title" v-else><i class="fa fa-spinner fa-spin"></i></h1>
      <div class="content">
        <button @click="boardView = 'pick'" class="button" :class="{ 'is-primary is-active' : boardView === 'pick' }">Pick View</button>
        <button @click="boardView = 'adp'" class="button" :class="{ 'is-primary is-active' : boardView === 'adp' }">ADP View</button>
      </div>
      <section v-if="currentDraft">
        <div class="columns is-mobile is-gapless is-multiline">
          <div class="column" v-for="team in teams">
            <team :team="team"></team>
          </div>
        </div>
      </section>
      <section v-if="currentDraft">
        <round v-for="(round, key) in picksByRound"
          :round="round"
          :boardView="boardView"
          :adp="adp"
          :players="players"
          @click="launchPickModal">
        </round>
      </section>
    </div>
    <modal v-if="showModal" :modalContent="modalContent" @close="showModal = false"></modal>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import Round from './Round.vue';
import Team from './Team.vue';
import Modal from '../Modal.vue';
import roundPicksMap from '../../utils/utils';

export default {
  name: 'draft-board',
  components: {
    Team,
    Round,
    Modal,
  },
  data() {
    return {
      title: 'The Draft Board',
      showModal: false,
      modalContent: '',
      boardView: 'pick',
    };
  },
  computed: {
    ...mapGetters([
      'bayesianValues',
      'currentDraft',
      'adp',
      'players',
    ]),
    teams() {
      return this.currentDraft.users;
    },
    picksByRound() {
      return roundPicksMap(this.currentDraft.rounds, this.currentDraft.picks);
    },
    bayesianMaxValue() {
      return this.bayesianValues.filter(p => p.overall === 1).pop().value;
    },
  },
  methods: {
    launchPickModal(pick) {
      const team = this.getTeamById(pick.team);
      const pickValues = this.getPickValues(pick);
      const value = (pickValues.value / this.bayesianMaxValue) * 100;

      this.modalContent = `
        <h3 class="title">Pick #${pick.overall} (${pick.round}.${pick.pickInRound})</h3>
        <p>Currently owned by: ${team.name}</p>
        <p>draftpicktradecalculator.com value: <strong>${pickValues.value}</strong></p>
        <progress class="progress" value="${value}" max="100">${value}%</progress>
        <p>
          <button class="button is-primary">Trade for this pick</button>
          <button class="button is-secondary">Add to trade</button>
        </p>
      `;
      this.showModal = true;
    },
    getTeamById(id) {
      return this.teams.filter(team => team.id === id).pop();
    },
    getPickValues(pick) {
      return this.bayesianValues.filter(p => p.overall === pick.overall).pop();
    },
  },
  created() {
    this.$store.dispatch('getAllDrafts');
    this.$store.dispatch('getPickValuesBayesian');
    this.$store.dispatch('getPlayers');
    this.$store.dispatch('getAdp');
  },
  ready() {
    this.picks = this.currentDraft.picks;
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
