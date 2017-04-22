<template>
  <td
    class="pick"
    :class="[{
      'is-muted': isMuted,
      'is-selected' : isSelected,
      'is-available' : isAvailable,
      'is-receiving' : isReceiving,
      'is-giving' : isGiving,
      'is-player' : boardView === 'adp',
    }, playerPositionClass ? `pick--${playerPositionClass}` : '']"
  >
    <a
      class="pick__clickable"
      @click.prevent="onPickClick"
    >
      <div class="pick__numbers">
        <b class="pick__overall">{{ pick.overall }}</b>
        <small class="pick__round">{{ pick.round }}.{{ pick.pickInRound }}</small>
      </div>
      <div v-if="boardView === 'adp'" class="pick__player">
        <span class="player-forename" v-html="playerInfo.forename"></span>
        <span class="player-surname" v-html="playerInfo.surname"></span>
      </div>
      <div class="pick__team" v-if="!isSelected">
        <span class="tag is-white">{{ teamInfo.displayName }}</span>
      </div>
    </a>
  </td>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex';
  import { SELECT_PICK } from '../../store/mutations';
  import { getTeamById, getPlayerById } from '../../utils';

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
        'currentUser',
        'allUsers',
        'adp',
      ]),
      isSelected() {
        return this.pick.team === this.selectedTeam;
      },
      isMuted() {
        return this.currentTrade.id && this.currentTrade.receivingPicks.length > 0 &&
          !(this.isAvailable || this.isOwnPick);
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
        return this.pick.team === this.currentTrade.receivingTeam;
      },
      isOwnPick() {
        return this.pick.team === this.currentTrade.givingTeam;
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
            const team = getTeamById(this.pick.team);
            resolve(team);
          });
        },
        default: {
          displayName: '',
        },
      },
      playerInfo: {
        get() {
          return new Promise(resolve => {
            const adpInfo = this.adp[Number(this.pick.overall) - 1];
            const player = getPlayerById(adpInfo.id);
            const playerName = player.name.split(', ').reverse();
            resolve({
              forename: playerName[0],
              surname: playerName[1],
              position: player.position,
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
        this.$bus.$emit('pickModal.open');
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import "~bulma/utilities/variables";

  .pick {
    cursor: pointer;
    position: relative;
    z-index: inherit;
    height: 100%;
    text-align: center;
    word-break: break-word;
    border: 2px solid $white-ter;
    transition:
      background-color 0.2s ease-in-out,
      color 0.2s ease-in-out,
      transform 0.2s ease-in-out,
      border-color 0.2s ease-in-out;

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

  .pick__clickable {
    min-height: 80px;
    padding: 0.2em 0.3em;
    display: block;
    width: 100%;
    color: inherit;
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

    .pick__clickable {
      min-height: 100px;
    }
  }

  .is-muted {
    opacity: 0.7;
  }

  .is-available {
    background-color: $white-ter;
    border-color: $white-ter;
    color: $grey-darker;
  }

  .is-selected {
    background-color: $grey-dark;
    border-top-color: $grey-dark;
    border-bottom-color: $grey-dark;
    color: white;
  }

  .is-receiving,
  .is-giving {
    transform: scale(1.1);
    z-index: 1;
    box-shadow: 0 2px 1px rgba(0,0,0,.1);
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
