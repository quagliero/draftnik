import Vue from 'vue';
import Vuex from 'vuex';
import teams from './modules/teams';
import drafts from './modules/drafts';
import pickValues from './modules/pick-values';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';


export default new Vuex.Store({
  modules: {
    teams,
    drafts,
    pickValues,
  },
  strict: debug,
});
