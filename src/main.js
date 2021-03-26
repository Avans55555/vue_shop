import Vue from 'vue'
import App from './App.vue'
import store from "./store";
import router from './router'
import './plugins/element.js'
import axios from "axios";
import 'assets/font_j8nrxyppup8/iconfont.css'
Vue.prototype.$http=axios
axios.defaults.baseURL='http://www.ysqorz.top:8888/api/private/v1/'
axios.interceptors.request.use(config=>{
  config.headers.Authorization=window.sessionStorage.getItem('token')
  return config
})
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
