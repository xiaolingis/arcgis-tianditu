<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
    export default {
        name: 'App'
    }
</script>

<style>
    html,body{
        height: 100%;
        margin: 0;
        padding: 0;
    }
    #app {
        height: 100%;
    }
</style>
