import Vue from 'vue';
import Router from 'vue-router';
import dashboard from 'src/pages/dashboard';
import createPage from 'src/pages/workflow/create';
import constructing from 'src/pages/workflow/constructing';

Vue.use(Router);


export default new Router({
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: dashboard,
    },
    {
      path: '/create',
      name: 'createPage',
      component: createPage,
    },
    {
      path: '/constructing',
      name: 'constructing',
      component: constructing,
    },
  ],
});
