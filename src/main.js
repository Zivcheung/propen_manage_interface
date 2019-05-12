// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

// font awesome
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'simplebar/dist/simplebar.css';
import observer from 'src/utils/observer';
import Vue from 'vue';
import store from 'src/store';
import axios from 'axios';
import lang from 'element-ui/lib/locale/lang/en';
import locale from 'element-ui/lib/locale';
import 'element-ui/lib/theme-chalk/index.css';
import elementUI from 'element-ui';
import App from './App';
import router from './router';

Vue.config.productionTip = false;

// elementUI dependency
locale.use(lang);
Vue.use(elementUI);

// provide simple observer channel
Vue.prototype.$$observer = observer;

// inject global ajax plugin
const baseURL = process.env === 'production' ? 'todo' : 'http://localhost:3000/REST/manageSite/';
Vue.prototype.$$axios = axios.create({
  baseURL,
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
});
