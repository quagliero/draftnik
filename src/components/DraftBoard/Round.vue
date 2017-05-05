<template>
  <tr>
    <template v-if="boardView === BoardView.STACK">
      <td class="board__number round-number">
        {{ number }}
      </td>
      <td
        v-for="picks in pickDirection"
        class="board__cell"
      >
        <pick
          v-for="pick in picks"
          :pick="pick"
          :key="pick.overall"
        />
      </td>
    </template>
    <template v-else>
      <td
        v-for="pick in pickDirection"
        class="board__cell"
      >
        <pick
          :pick="pick"
          :key="pick.overall"
        />
      </td>
    </template>
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

  .round-number {
    font-size: 1.2rem;
    padding: 0 10px;
    vertical-align: middle;
    text-align: center;
    background-color: $white-ter;
    color: $grey-darker;
    border: 1px solid $white;
  }
</style>
