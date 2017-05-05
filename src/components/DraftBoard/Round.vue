<template>
  <tr name="flip-row" is="transition-group">
    <td
      v-for="(pick, i) in pickDirection"
      class="board__cell flip-row-item"
      :key="`pick_${pick.overall}`"
    >
      <pick
        :pick="pick"
      />
    </td>
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
      number: {
        type: Number,
      },
      picks: {
        type: Array,
        required: true,
      },
    },
    data() {
      return {
        BoardView,
      };
    },
    computed: {
      ...mapGetters([
        'boardView',
      ]),
      // create local version as we reverse it and therefore mutate the state
      standardRound() {
        return this.picks;
      },
      reverseRound() {
        return this.picks.slice(0).reverse();
      },
      pickDirection() {
        // odd numbered rounds should print in reverse on snake view
        if (this.boardView === BoardView.SNAKE && (this.number % 2 === 0)) {
          return this.reverseRound;
        }

        return this.standardRound;
      },
    },
  };
</script>

<style lang="scss">
  @import "~bulma/utilities/variables";

  $count: 12;

  .flip-row-item {
     transition: opacity 0.4s ease-in-out;
  }
  .flip-row-move {
    transform: scale(0.85);
    opacity: 0.75;

    @for $i from 1 through $count {
      $delay: ($i / 12) * 0.3;
      &:nth-child(#{$i}) {
        transition: transform 0.3s ease-in-out #{$delay}s;
      }
    }
  }



</style>
