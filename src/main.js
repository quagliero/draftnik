import Vue from 'vue';
import AsyncComputed from 'vue-async-computed';
import { sync } from 'vuex-router-sync';
import App from './App.vue';
import store from './store';
import router from './router';

Vue.use(AsyncComputed);

// sync the router with the vuex store.
// this registers `store.state.route`
sync(store, router);


// Create a global Event Bus
const EventBus = new Vue();

// Add to Vue properties by exposing a getter for $bus
Object.defineProperties(Vue.prototype, {
  $bus: {
    get() {
      return EventBus;
    },
  },
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
});
