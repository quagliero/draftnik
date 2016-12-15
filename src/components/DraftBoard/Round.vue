<template>
  <div class="columns is-mobile is-gapless is-multiline">
    <div class="column" v-for="pick in checkRound">
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
      adp: {
        type: Array,
      },
      players: {
        type: Array,
      },
    },
    computed: {
      checkRound() {
        // odd numbered rounds should print like a snake
        return (this.index % 2 === 0) ? this.round.reverse() : this.round;
      },
    },
    methods: {
      handleClick(pick) {
        this.$emit('click', pick);
      },
    },
  };
</script>
