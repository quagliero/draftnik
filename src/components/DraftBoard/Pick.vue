<template>
  <div class="pick card is-fullwidth" :class="[{ 'is-selected' : isSelected }, playerPositionClass ]" @click="handleClick">
    <b>{{ pick.overall }}</b><br>
    <small>{{ pick.round }}.{{ pick.pickInRound }}</small><br />
    <em><small>{{ teamInfo.name }}</small></em>
    <div v-show="boardView === 'adp'">
      <span class="player-name">{{ playerInfo.name }}</span>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

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
        'selectedDraft',
        'adp',
        'players',
      ]),
      isSelected() {
        return this.pick.team === this.selectedTeam;
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
            const player = this.players.find(p => this.adp[this.pick.overall - 1].id === p.id);
            resolve({
              name: player.name.split(', ').reverse().join(' '),
              position: player.position,
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
      handleClick() {
        this.$emit('click', this.pick);
      },
    },
  };
</script>

<style scoped>
  .pick {
    cursor: pointer;
    height: 100%;
    word-break: break-word;
    padding: 0.2em;
    transition: background-color 0.2s, color 0.2s;
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
    background-color: #333;
    color: white;
  }
</style>
