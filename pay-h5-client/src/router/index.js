import Vue from 'vue';
import VueRouter from 'vue-router';
import index from '../views/index/index';
import pay from '../views/pay/pay';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/index',
    component: index,
    meta: { title: '首页' },
  },
  {
    path: '/pay',
    component: pay,
    meta: { title: '支付' },
  }
];

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router;
