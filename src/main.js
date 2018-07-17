import Vue from 'vue'
import App from './App'
import router from './router'
import API from './lib/api';
Vue.prototype.$getData = API.getData;
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue ({
    el: '#app',
    router,
    render: h => h (App)
})
