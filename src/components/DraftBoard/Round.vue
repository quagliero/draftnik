<template>
  <tr>
    <pick
      v-for="pick in roundDirection"
      :pick="pick"
      :key="pick.overall"
    />
  </tr>
</template>

<script>
  import { mapGetters } from 'vuex';
  import Pick from './Pick.vue';
  import { BoardView } from '../../constants';

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
    },
    data() {
      return {
        // create local version as we reverse it and therefore mutate the state
        standardRound: this.round,
        reverseRound: this.round.slice(0).reverse(),
      };
    },
    computed: {
      ...mapGetters([
        'boardView',
      ]),
      roundDirection() {
        // odd numbered rounds should print in reverse on snake view
        if (this.boardView === BoardView.SNAKE && (this.index % 2 === 0)) {
          return this.reverseRound;
        }

        return this.standardRound;
      },
    },
  };
</script>
