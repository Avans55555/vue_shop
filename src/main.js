import Vue from 'vue'
import App from './App.vue'
import store from "./store";
import router from './router'
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

//element ui
import './plugins/element.js'
//axios
import axios from "axios";
//阿里矢量图标
import 'assets/font_j8nrxyppup8/iconfont.css'
//树形菜单
import TreeTable from 'vue-table-with-tree-grid'
//moment事件插件
import moment from "moment";
moment.locale('zh-cn')
Vue.filter('dateformat', (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') =>{
  return moment(dataStr).format(pattern)
})
Vue.component('tree-table', TreeTable)
Vue.prototype.$http=axios
axios.defaults.baseURL='http://www.ysqorz.top:8888/api/private/v1/'
//使用拦截器发送 携带token的请求头
axios.interceptors.request.use(config=>{
  config.headers.Authorization=window.sessionStorage.getItem('token')
  return config
})
Vue.config.productionTip = false
//全局使用富文本编辑器
Vue.use(VueQuillEditor, /* { default global options } */)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
