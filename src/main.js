import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';

import axios from 'axios'
import router from './router'
import {store} from './store';
import _ from 'lodash';

axios.defaults.withCredentials = true
axios.defaults.baseURL = "http://localhost:8000"


//prototypes
Vue.prototype.$http = axios
Vue.prototype.$_ = _


Vue.component('app-home', require('./views/Home.vue').default);
Vue.component('app-register', require('./views/auth/Register.vue').default);
Vue.component('app-login', require('./views/auth/Login.vue').default);
Vue.component('app-forgot-password', require('./views/auth/password/Email.vue').default);
Vue.component('app-reset-password', require('./views/auth/password/Reset.vue').default);

Vue.component('app-snackbar', require('./components/TheSnackBar.vue').default);

Vue.config.productionTip = false

new Vue({
  vuetify,
  store,
  router,
  render: h => h(App)
}).$mount('#app')
