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
                  Linear
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
                <th></th>
                <team
                  v-for="team in currentDraftOrder"
                  :teamId="team"
                  :key="team.id"
                />
                <th></th>
              </tr>
            </thead>
            <tbody v-show="boardView === BoardView.STACK">
              <round-stack
                v-for="(slots, i) in picksByRoundByTeam"
                :key="`roundStack_${i}`"
                :number="i + 1"
                :slots="slots"
                @onPickClick="$emit('onPickClick')"
              />
            </tbody>
            <tbody v-show="boardView !== BoardView.STACK">
              <round
                v-for="(picks, i) in picksByRound"
                :key="`round${i}`"
                :number="i + 1"
                :picks="picks"
                @onPickClick="$emit('onPickClick')"
              />
            </tbody>
            <tfoot>
              <tr>
                <th></th>
                <team
                  v-for="team in currentDraftOrder"
                  :teamId="team"
                  :key="team.id"
                />
                <th></th>
              </tr>
              <tr>
                <th style="vertical-align: middle;">
                  <img src="/static/img/bayesian.png" class="board-value-icon"/>
                </th>
                <th
                  v-for="team in currentDraftOrder"
                  :key="team.id"
                  style="text-align: center; vertical-align: middle;"
                  class="board__cell"
                >
                  {{ getBayesianValues(team) }}
                </th>
                <th style="vertical-align: middle;">
                  <img src="/static/img/bayesian.png" class="board-value-icon"/>
                </th>
              </tr>
              <tr>
                <th style="vertical-align: middle;">
                  <img src="/static/img/dodds.png" class="board-value-icon board-value-icon--circle"/>
                </th>
                <th
                  v-for="team in currentDraftOrder"
                  :key="team.id"
                  style="text-align: center; vertical-align: middle;"
                  class="board__cell"
                >
                  {{ getDoddsValues(team) }}
                </th>
                <th style="vertical-align: middle;">
                  <img src="/static/img/dodds.png" class="board-value-icon board-value-icon--circle"/>
                </th>
              </tr>
            </tfoot>
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
import RoundStack from '../components/DraftBoard/RoundStack.vue';
import Team from '../components/DraftBoard/Team.vue';
import PickModal from '../components/Modals/PickModal.vue';
import { BoardView, PickView } from '../constants';
import { getPickValue } from '../utils';
import { getDoddsPickValue } from '../utils/dodds-calculator';

export default {
  name: 'draft-board',
  components: {
    Team,
    Round,
    RoundStack,
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
      'currentUser',
      'boardView',
      'pickView',
      'currentDraft',
      'currentDraftOrder',
      'picksByRound',
      'picksByRoundByTeam',
      'picksByTeam',
      'adp',
      'adpStart',
      'adpEnd',
      'adpTotal',
      'players',
    ]),
    dataLoaded() {
      // we've got all the data we want
      return [
        this.currentDraft != null,
        this.picksByRound.length > 0,
        this.picksByRoundByTeam.length > 0,
        this.adp.length > 0,
      ].every(el => el === true);
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

      if (view === PickView.ADP) {
        this.$store.dispatch('getWatchlist', {
          draft: this.currentDraft.id,
          user: this.currentUser.id,
        });
      }
    },
    getBayesianValues(team) {
      const picks = this.picksByTeam(team);
      const total = picks.reduce((acc, pick) => acc + getPickValue(pick.overall), 0);
      return total.toFixed(2);
    },
    getDoddsValues(team) {
      const picks = this.picksByTeam(team);
      const total = picks.reduce((acc, pick) => acc + getDoddsPickValue(pick.overall), 0);
      return total.toFixed(2);
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

.board__heading {
  min-width: 100px;
  max-width: 100px;
}

.board__cell {
  min-width: 100px;
  max-width: 100px;
  background-color: $white-bis;
  border: 2px solid $white-ter;
}

.board__number {
  max-width: 40px;
  min-width: 40px;
}

.round-number {
  font-size: 1.4rem;
  padding: 0 2px;
  vertical-align: middle;
  text-align: center;
  background-color: $grey-lighter;
  color: $grey-darker;
  border: 2px solid $white;
}

.board-toggle {
  margin: 0 auto;
  display: inline-block;
}

.board-value-icon {
  max-width: 50px;
}

.board-value-icon--circle {
  border-radius: 25px;
  border: 2px solid $white-ter;
}

</style>
