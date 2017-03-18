import Vue from 'vue';
import AsyncComputed from 'vue-async-computed';
import { sync } from 'vuex-router-sync';
import App from './App.vue';
// eslint-disable-next-line
import { db } from './database';
import store from './store';
import router from './router';

Vue.use(AsyncComputed);

// sync the router with the vuex store.
// this registers `store.state.route`
sync(store, router);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
});
