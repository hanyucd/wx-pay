import Vue from 'vue';
import App from './App.vue';
import router from './router'
import VueCookie from 'vue-cookie';
import './assets/css/reset.css';
import './assets/css/common.css';

Vue.use(VueCookie);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
