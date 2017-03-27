<template>
  <div class="section">
    <section class="container">
      <div class="column is-half-tablet is-offset-one-quarter-tablet">
        <h1 class="title">Reset your password</h1>
        <br />
        <div class="field has-text-left">
          <label class="label">Your email address</label>
          <p class="control has-icon">
            <input v-model="email" class="input" name="email" type="email" placeholder=""/>
            <span class="icon is-small">
              <i class="fa fa-envelope"></i>
            </span>
          </p>
        </div>
        <div class="field">
          <p class="control" v-if="passwordResetSent !== true">
            <button @click="handleResetPassword" class="button is-primary">
              Send password reset email
            </button>
          </p>
          <p class="notification is-info" v-if="passwordResetSent === true">
            Email sent! Please check your inbox.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  export default {
    name: 'password-reset',
    data() {
      return {
        email: null,
      };
    },
    computed: {
      ...mapGetters([
        'passwordResetSent',
      ]),
    },
    methods: {
      ...mapActions([
        'resetPassword',
      ]),
      handleResetPassword() {
        this.resetPassword(this.email);
      },
    },
  };
</script>

<style>

</style>
