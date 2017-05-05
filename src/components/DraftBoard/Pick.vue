<template>
  <a
    class="pick"
    @click.prevent="onPickClick"
    :class="[
      {
        'pick--is-muted': isMuted,
        'pick--is-selected' : isSelected,
        'pick--is-available' : isAvailable,
        'pick--is-receiving' : isReceiving,
        'pick--is-giving' : isGiving,
        'pick--is-player' : pickView === PickView.ADP,
      },
      playerPositionClass ? `pick--${playerPositionClass}` : '',
    ]"
  >
    <span v-show="pickView === PickView.TEAM" :style="brandBackground"></span>
    <div class="pick__inner">
      <div class="pick__numbers">
        <b class="pick__overall">{{ pick.overall }}</b>
        <small class="pick__round">{{ pick.round }}.{{ pick.pickInRound }}</small>
      </div>
      <div v-if="pickView === PickView.ADP" class="pick__player">
        <span class="player-forename">{{ playerInfo.forename }}</span>
        <span class="player-surname">{{ playerInfo.surname }}</span>
        <span class="pick__team">
          {{ playerInfo.position }} &ndash; {{ playerInfo.team }}
        </span>
      </div>
      <div v-show="pickView === PickView.TEAM" class="pick__team">
        <span
          class="tag"
          v-html="teamInfo.displayName"
        ></span>
      </div>
    </div>
    <span v-show="pickView === PickView.ADP" :style="brandMarker"></span>
  </a>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex';
  import { SELECT_PICK } from '../../store/mutations';
  import { getTeamById, getPlayerById } from '../../utils';
  import { PickView, BoardView, TeamBrand } from '../../constants';

  export default {
    name: 'pick',
    props: {
      pick: {
        required: true,
      },
    },
    data() {
      return {
        PickView,
        BoardView,
        TeamBrand,
      };
    },
    computed: {
      ...mapGetters([
        'pickView',
        'boardView',
        'selectedTeam',
        'currentTrade',
        'currentUser',
        'currentDraftOrder',
        'allUsers',
        'adp',
      ]),
      brandBackground() {
        return {
          position: 'absolute',
          opacity: (this.isSelected) ? 0 : 0.5,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          transition: 'opacity 0.3s ease-in-out',
          backgroundColor: this.brand.BACKGROUND,
        };
      },
      brandMarker() {
        return {
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: 0,
          borderTop: '15px solid transparent',
          borderBottom: '0px solid transparent',
          borderRight: `15px solid ${this.brand.BACKGROUND}`,
          opacity: (this.pickView === PickView.ADP) ? 1 : 0.75,
        };
      },
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
        if (this.pickView === PickView.ADP) {
          if (this.playerInfo.position) {
            return this.playerInfo.position.toLowerCase();
          }
        }

        return '';
      },
      brand() {
        return TeamBrand[this.currentDraftOrder.indexOf(this.pick.team)] || {};
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
            let playerName = player.name.split(' ');
            if ((playerName.indexOf('Defense') > -1) && playerName.length === 3) {
              playerName = [[playerName[0], playerName[1]].join(' '), playerName[2]];
            }
            resolve({
              forename: playerName[0],
              surname: playerName[1],
              position: player.pos,
              team: player.team,
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

<style lang="scss">
  @import "~bulma/utilities/variables";

  .pick {
    min-height: 80px;
    padding: 0.2em 0.3em;
    display: block;
    width: 100%;
    cursor: pointer;
    position: relative;
    z-index: 1;
    height: 100%;
    text-align: center;
    word-break: break-word;
    color: $grey-dark;
    background-color: $white;
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

    &:hover, &:focus {
      opacity: 0.9
    }
  }

  .pick + .pick {
    border-top: 2px solid $white-bis;
  }

  .pick__inner {
    position: relative;
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
    font-size: 0.8em;
    font-weight: normal;
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

  .pick--is-player {
    min-height: 120px;
  }

  .pick--is-muted {
    opacity: 0.5;
  }

  .pick--is-available {
    background-color: $white-ter;
    border-color: $white-ter;
    color: $grey-darker;
  }

  .pick--is-selected {
    background-color: $grey-dark;
    color: white;

    &:hover, &:focus {
      color: white;
    }
  }

  .pick--is-receiving {
    background-color: $green;
    color: $grey-darker;

    &.pick--is-player {
      box-shadow: inset 0 0 1rem rgba(mix(black, $green, 50%), .3);
    }
  }

  .pick--is-giving {
    background-color: $yellow;
    color: $grey-darker;

    &.pick--is-player {
      box-shadow: inset 0 0 1rem rgba(mix(black, $yellow, 50%), .3);
    }
  }

  .name-fade-enter-active, .name-fade-leave-active {
    transition: opacity .2s ease-in-out;
  }

  .name-fade-enter, .name-fade-leave-active {
    opacity: 0;
  }
</style>
