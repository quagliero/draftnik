<template>
  <tr>
    <pick
      v-for="pick in checkRound"
      :pick="pick"
      :key="pick.overall"
      :boardView="boardView"
    />
  </tr>
</template>

<script>
  import Pick from './Pick.vue';

  export default {
    name: 'round',
    components: {
      Pick,
    },
    props: {
      index: {
        type: String,
      },
      round: {
        type: Array,
        required: true,
      },
      boardView: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        // create local version as we reverse it and therefore mutate the state
        displayRound: this.round.slice(0),
      };
    },
    computed: {
      checkRound() {
        // odd numbered rounds should print like a snake
        return (this.index % 2 === 0) ? this.displayRound.reverse() : this.displayRound;
      },
    },
  };
</script>
