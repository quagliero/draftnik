<template>
  <div class="card is-fullwidth" :class="{ 'is-selected' : isSelected }">
    <b @click="handleClick(team.id)">{{ team.name }}</b>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex';

  export default {
    name: 'team',
    props: {
      team: {
        type: Object,
        required: true,
      },
      selectedTeam: {},
    },
    computed: {
      ...mapGetters([
        'selectedTeam',
      ]),
      isSelected() {
        return this.team.id === this.selectedTeam;
      },
    },
    methods: {
      ...mapMutations({
        selectTeam: 'SELECT_TEAM',
      }),
      handleClick(value) {
        if (!(this.isSelected)) {
          this.selectTeam({ teamId: value });
        }
      },
    },
  };
</script>

<style scoped>
  .card {
    cursor: pointer;
  }

  .is-selected {
    background-color: #333;
    color: white;
  }
</style>
