<template>
  <div class="pick card is-fullwidth" :class="[{ 'is-selected' : isSelected }, playerPositionClass ]" @click="handleClick">
    <b>{{ pick.overall }}</b><br>
    <small>{{ pick.round }}.{{ pick.pickInRound }}</small>
    <div v-if="boardView === 'adp'">
      <span class="player-name">{{ playerInfo.name }}</span>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'pick',
    computed: {
      ...mapGetters([
        'selectedTeam',
      ]),
      isSelected() {
        return this.pick.team === this.selectedTeam;
      },
      playerInfo() {
        const player = this.players.filter(p => this.adp[this.pick.overall - 1].id === p.id).pop();
        return {
          name: (player) ? player.name.split(', ').reverse().join(' ') : '',
          position: (player) ? player.position : '',
        };
      },
      playerPositionClass() {
        return (this.boardView === 'adp') ? this.playerInfo.position.toLowerCase() : '';
      },
    },
    props: {
      pick: {
        type: Object,
        required: true,
      },
      boardView: {
        type: String,
      },
      adp: {
        type: Array,
      },
      players: {
        type: Array,
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
