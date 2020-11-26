import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'
import echarts from 'echarts'
import store from './router/index.js'
import Vuex from 'vuex'
Vue.prototype.$echarts = echarts

Vue.config.productionTip = false

Vue.use(Vuex)

axios.defaults.baseURL = 'http://192.168.3.49:8089/library'
    // axios.defaults.baseURL = 'http://100.2.166.44:8089/library'

new Vue({
    store,
    router,
    render: h => h(App)
}).$mount('#app')