import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';


import axios from 'axios'

Vue.prototype.$http = axios;

axios.defaults.baseURL = "https://b-metathink-oq2kbk2w0.now.sh/api";

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
