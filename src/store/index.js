import Vue from 'vue';
import Vuex from 'vuex';
import workflow from './modules/workflow';


const dev = process.env.NODE_ENV !== 'production';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    workflow,
  },
  strict: dev,
});
