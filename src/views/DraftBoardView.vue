<template>
  <section class="section">
    <h1 class="title" v-if="selectedDraft">{{ selectedDraft.name }}</h1>
    <div v-if="!dataLoaded">Fetching draft, team, and ADP data <i class="fa fa-spinner fa-spin"></i></div>
      <template v-if="dataLoaded">
        <div class="content">
          <button @click="boardView = 'pick'" class="button" :class="{ 'is-primary is-active' : boardView === 'pick' }">Pick View</button>
          <button @click="boardView = 'adp'" class="button" :class="{ 'is-primary is-active' : boardView === 'adp' }">ADP View</button>
        </div>
        <div class="scroll-container">
          <div class="board container">
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
              @onPickClick="handleClickPick">
            </round>
          </section>
        </div>
      </div>
    </template>
    <transition name="fade">
      <pick-modal
        v-if="showPickModal"
        @close="showPickModal = false"
      />
    </transition>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import Round from '../components/DraftBoard/Round.vue';
import Team from '../components/DraftBoard/Team.vue';
import PickModal from '../components/Modals/PickModal.vue';

export default {
  name: 'draft-board',
  components: {
    Team,
    Round,
    PickModal,
  },
  data() {
    return {
      showPickModal: false,
      modalContent: '',
      boardView: 'pick',
    };
  },
  computed: {
    ...mapGetters([
      'selectedDraft',
      'picksByRound',
      'adp',
      'players',
    ]),
    teams() {
      return this.selectedDraft.users;
    },
    dataLoaded() {
      // we've got all the data we want
      return this.selectedDraft && this.picksByRound && this.players.length && this.adp.length;
    },
  },
  methods: {
    handleClickPick() {
      this.showPickModal = true;
    },
  },
  created() {
    this.$store.dispatch('getAllDrafts');
    this.$store.dispatch('getPickValuesBayesian');
    this.$store.dispatch('getPlayers');
    this.$store.dispatch('getAdp');
    this.$store.dispatch('getSavedTrades');
  },
};

</script>

<style lang="scss">
@import "~bulma/variables";

.scroll-container {
  padding: 1px 0;
  overflow-x: scroll;
  margin: 2rem -10px 1rem;
  width: 100%;

  @media screen and (max-width: 850px) {
    box-shadow: inset -3px -2px 5px rgba(0,0,0,.1), inset 3px -2px 5px rgba(0,0,0,.1);
    border-right: 2px dashed $grey-light;
    border-left: 2px dashed $grey-light;
  }
}

.board {
  min-width: 800px;
  width: 100%;
  padding: 1px; // prevent box-shadow clipping
  @media screen and (max-width: 850px) {
    padding-left: 0px;
    padding-right: 0px;
  }

  .columns {
    margin-bottom: 1rem !important;
  }
}
</style>
