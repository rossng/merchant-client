import Vue from 'vue';
import Router from 'vue-router';
import UploadContractPackage from '@/components/UploadContractPackage';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'UploadContractPackage',
      component: UploadContractPackage
    }
  ]
});
