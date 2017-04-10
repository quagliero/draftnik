import Vue from 'vue';
import Router from 'vue-router';
import DraftBoardView from '../views/DraftBoardView.vue';
import LoginView from '../views/LoginView.vue';
import UserView from '../views/UserView.vue';
import UserHome from '../components/User/Home.vue';
import UserTrade from '../components/User/Trade.vue';
import PasswordResetView from '../views/PasswordResetView.vue';
import AdminView from '../views/AdminView.vue';
import store from '../store';

Vue.use(Router);

const checkAuth = (to, from, next) => {
 // we must wait for the store to be initialized
  if (store.state.auth.authenticated === null) {
    // watch the authenticated prop
    store.watch(
      (state) => state.auth.authenticated,
      (value) => {
        if (value === true) {
          next();
        } else {
          next('login');
        }
      },
    );
  } else if (store.state.auth.authenticated === true) {
    next();
  } else {
    next('login');
  }
};

const router = new Router({
  routes: [
    { path: '/', redirect: '/board' },
    {
      name: 'board',
      path: '/board',
      component: DraftBoardView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      beforeEnter: (to, from, next) => {
        // check if user is logged in, if so, redirect
        //  - basically a one-off inverse of checkAuth
        if (store.state.auth.authenticated == null) {
          store.watch(
            (state) => state.auth.authenticated,
            (value) => {
              if (value === true) {
                next('me');
              } else {
                next();
              }
            },
          );
        } else if (store.state.auth.authenticated === true) {
          next('me');
        } else {
          next();
        }
      },
    },
    {
      name: 'reset',
      path: '/password-reset',
      component: PasswordResetView,
    },
    {
      name: 'me',
      path: '/my-draft',
      component: UserView,
      beforeEnter: (to, from, next) => {
        checkAuth(to, from, next);
      },
      children: [
        {
          path: '',
          component: UserHome,
        },
        {
          name: 'trade',
          path: 'trades/:id',
          component: UserTrade,
          props: true,
        },
      ],
    },
    {
      name: 'admin',
      path: '/admin',
      component: AdminView,
      beforeEnter: (to, from, next) => {
        if (store.state.users.currentUser.isAdmin === true) {
          next();
        } else {
          next('login');
        }
      },
    },
  ],
  linkActiveClass: 'is-active',
});

// need to do this here so `isAuthenticated` in beforeEach
// works if the first page you hit requires you to be auth'd
// ... race condition stuff
// store.dispatch('checkAuth');

// router.beforeEach((to, from, next) => {
//
// });

export default router;
