<template>
  <section class="section">
    <div class="board container">
      <div v-if="!selectedDraft" class="title"><i class="fa fa-spinner fa-spin"></i></div>
      <template v-if="selectedDraft">
        <h1 class="title">{{ selectedDraft.name }}</h1>
        <div class="content">
          <button @click="boardView = 'pick'" class="button" :class="{ 'is-primary is-active' : boardView === 'pick' }">Pick View</button>
          <button @click="boardView = 'adp'" class="button" :class="{ 'is-primary is-active' : boardView === 'adp' }">ADP View</button>
        </div>
        <section>
          <div class="columns is-mobile is-gapless is-multiline">
            <div class="column" v-for="team in teams">
              <team :team="team"></team>
            </div>
          </div>
        </section>
        <section>
          <round v-if="picksByRound" v-for="(round, key) in picksByRound"
            :key="key"
            :index="key"
            :round="round"
            :boardView="boardView"
            @click="launchPickModal">
          </round>
        </section>
      </template>
    </div>
    <transition name="fade">
      <modal v-if="showModal" :modalContent="modalContent" @close="showModal = false"></modal>
    </transition>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import Round from '../components/DraftBoard/Round.vue';
import Team from '../components/DraftBoard/Team.vue';
import Modal from '../components/Modal.vue';

export default {
  name: 'draft-board',
  components: {
    Team,
    Round,
    Modal,
  },
  data() {
    return {
      showModal: false,
      modalContent: '',
      boardView: 'pick',
    };
  },
  computed: {
    ...mapGetters([
      'bayesianValues',
      'selectedDraft',
      'picksByRound',
      'adp',
      'players',
    ]),
    teams() {
      return this.selectedDraft.users;
    },
    bayesianMaxValue() {
      return this.bayesianValues[0].value;
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
        <p>Players in this range: ${this.getPlayersInRange(pick.overall)}</p>
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
    getPlayersInRange(pick) {
      // map players by IDs and find the 3 players around the current pick in the format
      // n-1, n, n+1
      const players = this.adp.slice(pick - 1, pick + 2).map(pk =>
        this.players.find(player => player.id === pk.id));

      // format it
      return players.map(player => player.name.split(', ').reverse().join(' ')).join(', ');
    },
  },
  created() {
    this.$store.dispatch('getAllDrafts');
    this.$store.dispatch('getPickValuesBayesian');
    this.$store.dispatch('getPlayers');
    this.$store.dispatch('getAdp');
  },
  ready() {

  },
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

.board {
  margin-top: 2rem;
  .columns {
    margin-bottom: 1rem !important;
  }
}

.fade-enter-active, .fade-leave-active {
  .modal-content {
    margin-top: 0;
    transition: margin-top .3s;
  }
}
.fade-enter, .fade-leave-active {
  .modal-content {
    margin-top: -50%;
  }
}

</style>
