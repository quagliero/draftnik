<template>
  <tr>
    <td class="board__number round-number">
      {{ number }}
    </td>
    <td
      v-for="(slot, i) in slots"
      class="board__cell board_cell--stack"
      :key="i"
    >
      <pick
        v-for="pick in slot"
        :pick="pick"
        :key="pick.overall"
      />
    </td>
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
      number: {
        type: Number,
      },
      slots: {
        type: Array,
        required: true,
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
