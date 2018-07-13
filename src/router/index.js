import Vue from 'vue'
import Router from 'vue-router'
import Arcgis from '@/components/arcgis/Arcgis'
Vue.use (Router)

export default new Router ({
    mode:'history',
    routes: [
        {
            path: '/',
            name: 'Arcgis',
            component: Arcgis
        }
    ]
})
