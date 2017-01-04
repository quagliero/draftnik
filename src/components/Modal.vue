<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box content" v-html="modalContent">
      </div>
    </div>
    <button class="modal-close" @click="$emit('close')"></button>
  </div>
</template>

<script>
  export default {
    name: 'modal',
    props: ['showModal', 'modalContent'],
  };
</script>

<style lang="scss">

</style>
