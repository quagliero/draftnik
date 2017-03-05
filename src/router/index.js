import Vue from 'vue';
import Router from 'vue-router';
import DraftBoardView from '../views/DraftBoardView.vue';
import LoginView from '../views/LoginView.vue';
import UserView from '../views/UserView.vue';
import store from '../store';

Vue.use(Router);

const router = new Router({
  mode: 'history', // use html5 history API instead of /#!/ hashing URL routes
  routes: [
    { path: '/', redirect: '/board' },
    { path: '/board', component: DraftBoardView },
    {
      path: '/login',
      component: LoginView,
    },
    {
      name: 'me',
      path: '/me',
      component: UserView,
      meta: {
        auth: true,
      },
    },
  ],
  linkActiveClass: 'is-active',
});

// need to do this here so `isAuthenticated` in beforeEach
// works if the first page you hit requires you to be auth'd
// ... race condition stuff
// store.dispatch('checkAuth');

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.authenticated;
  if (to.meta.auth && !isAuthenticated) {
    next({ path: '/login' });
  } else {
    next();
  }
});

export default router;
