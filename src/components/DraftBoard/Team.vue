<template>
  <div class="team is-fullwidth" :class="{ 'is-selected' : isSelected }">
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
        this.selectTeam({ teamId: value });
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import "~bulma/variables";

  .team {
    cursor: pointer;
    width: 100px;
    border: 1px solid $grey-lighter;
  }

  .is-selected {
    background-color: $grey-dark;
    color: white;
  }
</style>
