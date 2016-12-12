<template>
  <div class="columns is-mobile is-gapless is-multiline">
    <div class="column" v-for="pick in round">
      <pick :pick="pick"></pick>
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
    },
  };
</script>
