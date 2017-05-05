<template>
  <section class="section board-wrapper">
    <h1 class="title" v-if="currentDraft">{{ currentDraft.displayName }}</h1>
    <div v-if="!dataLoaded">Fetching draft, team, and ADP data <i class="fa fa-spinner fa-spin"></i></div>
    <template v-if="dataLoaded">
      <div class="board-toggle">
        <div class="field field-horizontal">
          <div class="field-body">
            <div class="field has-addons has-addons-centered">
              <span class="control">
                <button
                  @click="setBoardView(BoardView.STACK)"
                  :class="[{
                    'is-primary is-active' : boardView === BoardView.STACK
                  }, 'button is-light']"
                >
                  Stack
                </button>
              </span>
              <span class="control">
                <button
                  @click="setBoardView(BoardView.SNAKE)"
                  :class="[{
                    'is-primary is-active' : boardView === BoardView.SNAKE
                  }, 'button is-light']"
                >
                  Snake
                </button>
              </span>
              <span class="control">
                <button
                  @click="setBoardView(BoardView.STANDARD)"
                  :class="[{
                    'is-primary is-active' : boardView === BoardView.STANDARD
                  }, 'button is-light']"
                >
                  Standard
                </button>
              </span>
            </div>
            <div class="field has-addons has-addons-centered">
              <span class="control">
                <button
                  @click="setPickView(PickView.TEAM)"
                  :class="[{
                    'is-info is-active' : pickView === PickView.TEAM
                  }, 'button is-light']"
                >
                  Teams
                </button>
              </span>
              <span class="control">
                <button
                  @click="setPickView(PickView.ADP)"
                  :class="[{
                    'is-info is-active' : pickView === PickView.ADP
                  }, 'button is-light']"
                >
                  ADP
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="scroll-container">
        <div class="board container">
          <table class="board__table">
            <thead>
              <tr>
                <!-- for round number alignment -->
                <th v-if="boardView === BoardView.STACK"></th>
                <team
                  v-for="team in currentDraftOrder"
                  :teamId="team"
                  :key="team"
                />
              </tr>
            </thead>
            <tbody>
              <round
                v-for="(picks, i) in rounds"
                :key="i"
                :number="i + 1"
                :picks="picks"
                @onPickClick="$emit('onPickClick')"
              />
            </tbody>
          </table>
        </div>
      </div>
      <div class="content">
        <small>ADP data provided by <a href="https://fantasyfootballcalculator.com" target="_blank">fantasyfootballcalculator.com</a> from {{ adpTotal }} drafts between {{ adpStart }} and {{ adpEnd }}</small>
      </div>
    </template>
  </section>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { SELECT_BOARD_VIEW, SELECT_PICK_VIEW } from '../store/mutations';
import Round from '../components/DraftBoard/Round.vue';
import Team from '../components/DraftBoard/Team.vue';
import PickModal from '../components/Modals/PickModal.vue';
import { BoardView, PickView } from '../constants';

export default {
  name: 'draft-board',
  components: {
    Team,
    Round,
    PickModal,
  },
  data() {
    return {
      BoardView,
      PickView,
    };
  },
  computed: {
    ...mapGetters([
      'boardView',
      'pickView',
      'currentDraft',
      'currentDraftOrder',
      'picksByRound',
      'picksByRoundByTeam',
      'adp',
      'adpStart',
      'adpEnd',
      'adpTotal',
      'players',
    ]),
    rounds() {
      if (this.boardView === BoardView.STACK) {
        return this.picksByRoundByTeam;
      }

      return this.picksByRound;
    },
    dataLoaded() {
      // we've got all the data we want
      return this.currentDraft && this.rounds && this.players && this.adp.length;
    },
  },
  methods: {
    ...mapMutations({
      SELECT_BOARD_VIEW,
      SELECT_PICK_VIEW,
    }),
    setBoardView(view) {
      this.SELECT_BOARD_VIEW(view);
    },
    setPickView(view) {
      this.SELECT_PICK_VIEW(view);
    },
  },
};

</script>

<style lang="scss">
@import "~bulma/utilities/variables";

.board-wrapper {
  padding-left: 0;
  padding-right: 0;
  text-align: center;
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
  .board__cell {
    min-width: 100px;
    max-width: 100px;
  }

  .board__number {
    max-width: 40px;
    min-width: 40px;
  }
}

.board-toggle {
  margin: 0 auto;
  display: inline-block;
}

</style>
