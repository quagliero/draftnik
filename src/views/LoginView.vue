<template>
  <div class="section">
    <section class="container">
      <form class="columns" @submit.prevent="handleSubmit" v-if="!(authenticated)">
        <div class="column is-half-tablet is-offset-one-quarter-tablet">
          <h1 class="title">Get busy trading</h1>
          <div class="field">
            <p class="control has-icon">
              <input v-model="credentials.email" :class="[
                'input',
                { 'is-danger': (validEmail === false) },
                { 'is-success': (validEmail === true) },
              ]" name="email" type="email" placeholder="Email">
              <span class="icon is-small">
                <i class="fa fa-envelope"></i>
              </span>
              <span v-if="validEmail === false" class="help is-danger">Please enter your email address</span>
            </p>
          </div>
          <div class="field">
            <p class="control has-icon">
              <input v-model="credentials.password" :class="[
                'input',
                { 'is-danger': (validPassword === false) },
                { 'is-success': (validPassword === true) },
                ]" name="password" type="password" placeholder="Password">
              <span class="icon is-small">
              <i class="fa fa-lock"></i>
            </span>
            <span v-if="validPassword === false" class="help is-danger">Please enter your password</span>
            </p>
          </div>
          <div class="content" v-if="authMessages">
            <p v-for="authMessage in authMessages" class="notification is-danger">
              <b>{{ authMessage.code }}</b><br/>
              {{ authMessage.message }}
            </p>
          </div>
          <p class="control">
            <button class="button is-primary">Login</button>
          </p>
        </div>
      </form>
    </section>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex';
  import { CLEAR_AUTH_MESSAGES } from '../store/mutations';

  export default {
    name: 'login-view',
    data() {
      return {
        credentials: {
          email: '',
          password: '',
        },
        validEmail: null,
        validPassword: null,
      };
    },
    computed: {
      ...mapGetters([
        'authenticated',
        'authMessages',
      ]),
    },
    methods: {
      ...mapMutations({
        CLEAR_AUTH_MESSAGES,
      }),
      handleSubmit() {
        this.CLEAR_AUTH_MESSAGES();

        this.validEmail = !!this.credentials.email;
        this.validPassword = !!this.credentials.password;
        if (!this.validEmail || !this.validPassword) {
          return false;
        }

        return this.$store.dispatch('login', this.credentials);
      },
    },
  };
</script>

<style scoped>
  .section {
    margin-top: 2rem;
  }
</style>
