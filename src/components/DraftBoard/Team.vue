<template>
  <div class="team is-fullwidth" :class="{ 'is-selected' : isSelected }">
    <b @click="handleClick(teamId)">{{ team.displayName }}</b>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex';

  export default {
    name: 'team',
    props: {
      teamId: {
        type: String,
        required: true,
      },
    },
    computed: {
      ...mapGetters([
        'selectedTeam',
        'allUsers',
      ]),
      isSelected() {
        return this.teamId === this.selectedTeam;
      },
      team() {
        return this.allUsers[this.teamId];
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
