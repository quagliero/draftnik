<template>
  <tr>
    <td class="board__number round-number">
      {{ number }}
    </td>
    <td
      v-for="(slot, i) in slots"
      class="board__cell board_cell--stack"
      :key="`slot_${i}`"
    >
      <pick
        v-for="pick in slot"
        :pick="pick"
        :key="`slotPick_${pick.overall}`"
      />
    </td>
    <td class="board__number round-number">
      {{ number }}
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
