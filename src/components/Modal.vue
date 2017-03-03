<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box content">
        <slot></slot>
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
  // modal fade
  .modal-content {
    transition: margin-top .3s;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .2s;
  }

  .fade-enter, .fade-leave-active {
    opacity: 0;

    .modal-content {
      margin-top: -50%;
    }
  }
</style>
