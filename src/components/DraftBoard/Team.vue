<template>
  <th
    class="board__cell team"
    :class="{
      'is-selected' : isSelected,
      'is-adp-view' : pickView === PickView.ADP,
    }"
    @click="handleClick(teamId)"
  >
    <strong class="team__name">{{ team.teamName }}</strong>
  </th>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex';
  import { PickView } from '../../constants';

  export default {
    name: 'team',
    props: {
      teamId: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        PickView,
      };
    },
    computed: {
      ...mapGetters([
        'pickView',
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
    vertical-align: middle;
    background-color: $grey-lighter;
    border-left: 2px solid $white-ter;
    border-right: 2px solid $white-ter;
    border-top: 2px solid $white-ter;
    border-bottom: 1px solid $white-ter;
    padding: 5px;
    text-align: center;
    transition:
      background-color 0.2s ease-in-out,
      color 0.2s ease-in-out,
      border-color 0.2s ease-in-out;
  }

  .team__name {
    display: block;
    max-width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    height: 100%;
    color: inherit;
  }

  .is-adp-view {
    background-color: $white;
    color: $grey-dark;
  }

  .is-selected {
    background-color: $grey-dark;
    border-top-color: $grey-dark;
    color: white;
  }

</style>
