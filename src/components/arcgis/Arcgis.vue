<template>
        <div id="viewDiv"></div>
</template>

<script>
import { loadModules } from 'esri-loader';
import common from '../common/common'
    export default {
        name: 'HelloWorld',
        data () {
            return {
            }
        },
        mounted () {
            new common().loadBaseTitle()
        },
        methods:{}
    }
</script>
<style>
    /*@import url("http://localhost:8080/arcgis_js_api/library/4.7/esri/css/main.css");*/
    /*@import url("https://js.arcgis.com/4.7/esri/css/main.css");*/
    /*@import url("https://js.arcgis.com/4.8/esri/css/main.css");*/
    @import url("http://localhost:8080/4.8/esri/css/main.css");

    @import "css/arcgis.css";
</style>
