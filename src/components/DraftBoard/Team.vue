<template>
  <th
    class="team"
    :class="{ 'is-selected' : isSelected }"
    @click="handleClick(teamId)"
  >
    <b>{{ team.displayName }}</b>
  </th>
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
  @import "~bulma/utilities/variables";

  .team {
    cursor: pointer;
    min-width: 100px;
    background-color: $white;
    border-left: 2px solid $white-ter;
    border-right: 2px solid $white-ter;
    border-top: 2px solid $white-ter;
    border-bottom: 2px solid $white-ter;
    padding: 5px;
    text-align: center;
    transition:
      background-color 0.2s ease-in-out,
      color 0.2s ease-in-out,
      border-color 0.2s ease-in-out;
  }

  .is-selected {
    background-color: $grey-dark;
    border-top-color: $grey-dark;
    border-bottom-color: $grey-dark;
    color: white;
  }
</style>
