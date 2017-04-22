<template>
  <transition name="modal-fade">
    <div class="modal is-active">
      <div class="modal-background"></div>
      <div class="modal-content">
        <div class="box content">
          <slot></slot>
        </div>
      </div>
      <button class="modal-close" @click="close"></button>
    </div>
  </transition>
</template>

<script>
/* global document */
  export default {
    name: 'modal',
    props: ['close'],
    methods: {
      triggerClose(event) {
        if (event.keyCode === 27) {
          this.close();
        }
      },
    },
    mounted() {
      document.addEventListener('keydown', this.triggerClose);
    },
    beforeDestroy() {
      document.removeEventListener('keydown', this.triggerClose);
    },
  };
</script>

<style lang="scss">
  // modal fade
  .modal-content {
    transition: margin-top .3s;
  }

  .modal-fade-enter-active, .modal-fade-leave-active {
    transition: opacity .2s;
  }

  .modal-fade-enter, .modal-fade-leave-active {
    opacity: 0;

    .modal-content {
      margin-top: -50%;
    }
  }
</style>
