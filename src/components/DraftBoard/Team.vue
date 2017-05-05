<template>
  <th
    class="board__heading team"
    :class="{
      'is-selected' : isSelected,
      'is-adp-view' : pickView === PickView.ADP,
    }"
    :style="{ borderTopColor: brand.BACKGROUND }"
    @click="handleClick(teamId)"
  >
    <strong class="team__name">{{ team.teamName }}</strong>
  </th>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex';
  import { PickView, TeamBrand } from '../../constants';

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
        TeamBrand,
      };
    },
    computed: {
      ...mapGetters([
        'pickView',
        'selectedTeam',
        'allUsers',
        'currentDraftOrder',
      ]),
      isSelected() {
        return this.teamId === this.selectedTeam;
      },
      team() {
        return this.allUsers[this.teamId];
      },
      brand() {
        return TeamBrand[this.currentDraftOrder.indexOf(this.teamId)] || {};
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
    background-color: $white;
    border: 2px solid $white-ter;
    border-top-width: 2px;
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
