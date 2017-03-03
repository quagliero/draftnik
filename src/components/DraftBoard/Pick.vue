<template>
  <div
    class="pick card is-fullwidth"
    :class="[{
      'is-selected' : isSelected,
      'is-available' : isAvailable,
      'is-in-trade' : isInTrade,
    }, playerPositionClass ]"
    @click="onPickClick"
  >
    <b>{{ pick.overall }}</b><br>
    <small>{{ pick.round }}.{{ pick.pickInRound }}</small><br />
    <em><small>{{ teamInfo.name }}</small></em>
    <div v-show="boardView === 'adp'">
      <span class="player-name">{{ playerInfo.name }}</span>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex';
  import { SELECT_PICK } from '../../store/mutations';

  export default {
    name: 'pick',
    props: {
      pick: {
        type: Object,
        required: true,
      },
      boardView: {
        type: String,
      },
    },
    computed: {
      ...mapGetters([
        'selectedTeam',
        'currentTrade',
        'receivingTeam',
        'selectedDraft',
        'adp',
      ]),
      isSelected() {
        return this.pick.team === this.selectedTeam;
      },
      isInTrade() {
        return this.currentTrade.id && this.currentTrade.receivingPicks.find(pick =>
          this.pick.overall === pick.overall,
        );
      },
      isAvailable() {
        return this.pick.team === this.receivingTeam;
      },
      playerPositionClass() {
        if (this.boardView === 'adp') {
          if (this.playerInfo.position) {
            return this.playerInfo.position.toLowerCase();
          }
        }

        return '';
      },
    },
    asyncComputed: {
      teamInfo: {
        get() {
          return new Promise(resolve => {
            const team = this.selectedDraft.users.find(user => user.id === this.pick.team);
            resolve(team);
          });
        },
        default: {
          name: '',
          position: '',
        },
      },
      playerInfo: {
        get() {
          return new Promise(resolve => {
            const pick = this.adp[Number(this.pick.overall) - 1];
            resolve({
              name: pick.player.name.split(', ').reverse().join(' '),
              position: pick.player.position,
            });
          });
        },
        default: {
          name: '',
          position: '',
        },
      },
    },
    methods: {
      ...mapMutations({
        SELECT_PICK,
      }),
      onPickClick() {
        this.SELECT_PICK({ pick: this.pick });
        this.$emit('onPickClick', this.pick);
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import "~bulma/variables";

  .pick {
    cursor: pointer;
    height: 100%;
    word-break: break-word;
    padding: 0.2em 0.3em;
    position: relative;
    z-index: 1;
    transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out, transform 0.2s ease-in-out;
  }

  .rb {
    background-color: #a9dba9;
  }

  .wr {
    background-color: #ffe9a6;
  }

  .qb {
    background-color: #fea3aa;
  }

  .te {
    background-color: #7bd7fd;
  }

  .pk {
    background-color: #f2a2e8;
  }

  .def {
    background-color: #fbbf69;
  }

  .player-name {
    font-size: 0.9em;
  }

  .is-selected {
    background-color: $grey-dark;
    color: white;
  }

  .is-available {
    background-color: $white-ter;
    color: $grey-darker;
  }

  .is-in-trade {
    background-color: $yellow;
    color: $grey-darker;
    transform: scale(1.03);
    z-index: 2,
  }
</style>
