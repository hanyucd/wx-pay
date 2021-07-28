import Vue from 'vue';
import App from './App.vue';
import router from './router'
import VueCookie from 'vue-cookie';
import VConsole from 'vconsole';
import './assets/css/reset.css';
import './assets/css/common.css';

// 移动端调试
const vConsole = new VConsole();
Vue.use(vConsole);

Vue.use(VueCookie);
Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
