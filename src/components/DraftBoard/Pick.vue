<template>
  <div class="card is-fullwidth" :class="{ 'is-selected' : isSelected }">
    <b>{{ pick.overall }}</b><br>
    <small>{{ pick.round }}.{{ pick.pickInRound }}</small>
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
    },
    props: {
      pick: {
        type: Object,
        required: true,
      },
    },
  };
</script>

<style scoped>
  .is-selected {
    background-color: #00d1b2;
    color: white;
  }
</style>
