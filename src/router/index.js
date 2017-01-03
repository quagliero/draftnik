import Vue from 'vue';
import Router from 'vue-router';
import DraftBoardView from '../views/DraftBoardView.vue';
import UserView from '../views/UserView.vue';

Vue.use(Router);

export default new Router({
  mode: 'history', // use html5 history API instead of /#!/ hashing URL routes
  routes: [
    { path: '/', redirect: '/board' },
    { path: '/board', component: DraftBoardView },
    { path: '/me', component: UserView },
  ],
  linkActiveClass: 'is-active',
});
