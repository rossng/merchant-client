import Vue from 'vue';
import Router from 'vue-router';
import DeployContract from '@/components/DeployContract';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'DeployContract',
      component: DeployContract
    }
  ]
});
