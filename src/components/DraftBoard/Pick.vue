<template>
  <div
    class="pick is-fullwidth"
    :class="[{
      'is-selected' : isSelected,
      'is-available' : isAvailable,
      'is-receiving' : isReceiving,
      'is-giving' : isGiving,
      'is-player' : boardView === 'adp',
    }, `pick--${playerPositionClass}` ]"
    @click="onPickClick"
  >
    <div class="pick__numbers">
      <b class="pick__overall">{{ pick.overall }}</b>
      <small class="pick__round">{{ pick.round }}.{{ pick.pickInRound }}</small>
    </div>
    <div class="pick__team">{{ teamInfo.name }}</div>
    <div v-if="boardView === 'adp'" class="pick__player">
      <span class="player-forename" v-html="playerInfo.forename"></span>
      <span class="player-surname" v-html="playerInfo.surname"></span>
    </div>
    <div class="pick__flags">
      <i class="fa fa-gavel" v-if="pick.onTheBlock"></i>
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
      isReceiving() {
        return this.currentTrade.id && this.currentTrade.receivingPicks.find(pick =>
          this.pick.overall === pick.overall,
        );
      },
      isGiving() {
        return this.currentTrade.id && this.currentTrade.givingPicks.find(pick =>
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
            const playerName = pick.player.name.split(', ').reverse();
            resolve({
              forename: playerName[0],
              surname: playerName[1],
              position: pick.player.position,
            });
          });
        },
        default: {
          forename: '',
          surname: '',
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
    position: relative;
    z-index: 1;
    height: 100%;
    min-height: 80px;
    width: 100px;
    word-break: break-word;
    padding: 0.2em 0.3em;
    border: 1px solid $white-ter;
    transition: background-color 0.2s ease-in-out,
      color 0.2s ease-in-out,
      transform 0.2s ease-in-out;

    &--rb {
      background-color: mix(white, $green, 50%);
    }

    &--wr {
      background-color: mix(white, $yellow, 40%);
    }

    &--qb {
      background-color: mix(white, $red, 50%);
    }

    &--te {
      background-color: mix(white, $blue, 50%);
    }

    &--pk {
      background-color: mix(white, $purple, 50%);
    }

    &--def {
      background-color: mix(white, $orange, 30%);
    }
  }

  .pick__numbers {
    display: flex;
    align-items: center;
    padding: 0 5px;
  }

  .pick__round {
    margin-left: auto;
  }

  .pick__team {
    margin-bottom: 5px;
    margin-top: 5px;
    font-size: 0.9em;
  }

  .pick__player {
    font-weight: bold;
    font-size: 0.9rem;
  }
  .player-forename,
  .player-surname {
    display: block;
  }

  .player-surname {
    font-size: 1.3em;
    font-weight: bold;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .is-player {
    min-height: 110px;
  }

  .is-selected {
    background-color: $grey-dark;
    color: white;
  }

  .is-available {
    background-color: $white-ter;
    color: $grey-darker;
  }

  .is-receiving,
  .is-giving {
    transform: scale(1.05);
    z-index: 2;
    box-shadow: 0 0 1px rgba(0,0,0,.3);
  }

  .is-receiving {
    background-color: $green;
    color: $grey-darker;
    border-color: $green;
  }

  .is-giving {
    background-color: $yellow;
    border-color: $yellow;
    color: $grey-darker;
  }
</style>
