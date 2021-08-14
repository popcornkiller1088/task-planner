import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

/* eslint-disable */
Vue.filter('percentage', (value, decimals) => {
  if (!value) {
    value = 0;
  }

  if (!decimals) {
    decimals = 0;
  }

  value = value * 100;
  value = Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  value = value + '%';
  return value;
});
/* eslint-enable */

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App)
}).$mount('#app');
