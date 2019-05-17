// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import './plugins/axios'
import App from './App'
import router from './router'
import './plugins/element.js'
import editor from 'vue-markdown-editor-hsfy'
import viewer from 'vue-markdown-view-hsfy'
import store from './store'
import qs from 'qs'
import VCharts from 'v-charts'

Vue.use(editor)
Vue.use(viewer)
Vue.use(VCharts)
Vue.config.productionTip = false
Vue.prototype.history = (blogId) => {
  axios.post("/testapi/additionalData/userViewHistory", { blogId: blogId })
    .then(res => { console.log(res) }).catch(err => { })
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
