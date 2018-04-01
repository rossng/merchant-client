import Vue from 'vue';
import Router from 'vue-router';
import UploadCode from '@/components/UploadCode';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'UploadCode',
      component: UploadCode
    }
  ]
});
