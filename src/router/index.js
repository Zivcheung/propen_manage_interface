import Vue from 'vue';
import Router from 'vue-router';
import gallery from 'src/pages/gallery';
import createPage from 'src/pages/workflow/create';
import constructing from 'src/pages/workflow/constructing';
import materialCollectionPage from 'src/pages/workflow/materialCollection';
import inProcess from 'src/pages/inProcess';
import review from 'src/pages/workflow/review';
import finish from 'src/pages/workflow/finish';
import store from 'src/store';


Vue.use(Router);


const router = new Router({
  routes: [
    {
      path: '/',
      name: 'gallery',
      component: gallery,
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
    {
      path: '/material_collection',
      name: 'materialCollection',
      component: materialCollectionPage,
    },
    {
      path: '/review',
      name: 'wk-review-page',
      component: review,
    },
    {
      path: '/finish',
      name: 'wk-finish-page',
      component: finish,
    },
    {
      path: '/inProcess',
      name: 'inProcess',
      component: inProcess,
    },
    // fallback
    {
      path: '*',
      redirect: {
        name: 'gallery',
      },
    },
  ],
});

router.afterEach((to) => {
  const noClearList = [
    '/create',
    '/material_collection',
    '/constructing',
    '/review',
    '/finish',
  ];
  const dest = to.fullPath;
  // reset project store
  if (noClearList.indexOf(dest) < 0) {
    store.commit('workflow/resetProjectState');
    console.log('clearStore');
  }
  const idRequiredList = [
    '/material_collection',
    '/constructing',
    '/review',
    '/finish',
  ];
  // prevent empty id entering
  if (idRequiredList.indexOf(dest) > -1 &&
     store.state.workflow.currentProjectId === '') {
    router.push('/inProcess');
  }
});

export default router;
