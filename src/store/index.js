import Vue from 'vue';
import Vuex from 'vuex';
import teams from './modules/teams';
import drafts from './modules/drafts';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  modules: {
    teams,
    drafts,
  },
  strict: debug,
});
