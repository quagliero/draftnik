<template>
  <div class="pick card is-fullwidth" :class="{ 'is-selected' : isSelected }" @click="handleClick">
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
  }

  .is-selected {
    background-color: #00d1b2;
    color: white;
  }
</style>
