<template>
  <div class="columns is-mobile is-gapless is-multiline">
    <div class="column" v-for="pick in round">
      <pick :pick="pick" :boardView="boardView" :adp="adp" :players="players" @click="handleClick"></pick>
    </div>
  </div>
</template>

<script>
  import Pick from './Pick.vue';

  export default {
    name: 'round',
    components: {
      Pick,
    },
    props: {
      round: {
        type: Array,
        required: true,
      },
      boardView: {
        type: String,
        required: true,
      },
      adp: {
        type: Array,
      },
      players: {
        type: Array,
      },
    },
    methods: {
      handleClick(pick) {
        this.$emit('click', pick);
      },
    },
  };
</script>
