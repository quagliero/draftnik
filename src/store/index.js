import Vue from 'vue';
import Vuex from 'vuex';
import auth from './modules/auth';
import users from './modules/users';
import teams from './modules/teams';
import drafts from './modules/drafts';
import players from './modules/players';
import adp from './modules/adp';
import pickValues from './modules/pick-values';
import trade from './modules/trade';
import watchlist from './modules/watchlist';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  modules: {
    auth,
    users,
    teams,
    drafts,
    players,
    adp,
    pickValues,
    trade,
    watchlist,
  },
  strict: debug,
});
