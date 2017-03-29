<template>
  <section class="section board-wrapper">
    <h1 class="title" v-if="selectedDraft">{{ selectedDraft.displayName }}</h1>
    <div v-if="!dataLoaded">Fetching draft, team, and ADP data <i class="fa fa-spinner fa-spin"></i></div>
    <template v-if="dataLoaded">
      <div class="board-toggle">
        <div class="field has-addons">
          <span class="control">
            <button
              @click="boardView = 'pick'"
              :class="[{
                'is-primary is-active' : boardView === 'pick'
              }, 'button is-light']"
            >
              Pick View
            </button>
          </span>
          <span class="control">
            <button
              @click="boardView = 'adp'"
              :class="[{
                'is-primary is-active' : boardView === 'adp'
              }, 'button is-light']"
            >
              ADP View
            </button>
          </span>
        </div>
      </div>
      <div class="scroll-container">
        <div class="board container">
          <table class="board__table">
            <thead>
              <tr>
                <team
                  v-for="(team, uid) in teams"
                  :teamId="uid"
                  :key="uid"
                  :boardView="boardView"
                />
              </tr>
            </thead>
            <tbody>
              <round
                v-if="picksByRound"
                v-for="(round, key) in picksByRound"
                :key="key"
                :index="key"
                :round="round"
                :boardView="boardView"
                @onPickClick="$emit('onPickClick')"
              />
            </tbody>
          </table>
        </div>
      </div>
    </template>
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
      return this.selectedDraft.teams;
    },
    dataLoaded() {
      // we've got all the data we want
      return this.selectedDraft && this.picksByRound && this.players && this.adp.length;
    },
  },
};

</script>

<style lang="scss">
@import "~bulma/utilities/variables";

.board-wrapper {
  padding-left: 0;
  padding-right: 0;
}

.scroll-container {
  padding: 1px 0;
  overflow-x: scroll;
  margin: 2rem auto;
  width: 100%;
  -webkit-overflow-scrolling: touch; /* lets it scroll smoothly */

  @media screen and (max-width: 1200px) {
    box-shadow: inset -3px -2px 5px rgba(0,0,0,.1), inset 3px -2px 5px rgba(0,0,0,.1);
    border-right: 1px solid $grey-light;
    border-left: 1px solid $grey-light;
  }
}

.board {
  min-width: 1200px; // 12 picks at 100
  max-width: 1600px;
  width: 100%;

  .columns {
    margin-bottom: 0 !important;
  }
}

.board__table {
  table-layout: fixed;
}

.board-toggle {
  margin: 0 auto;
  display: inline-block;
}
</style>
