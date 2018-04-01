<template>
    <div id="app">
        <h1>Merchant Client</h1>
        <UploadCode/>
        <Marketplace/>
    </div>
</template>

<script>
    import UploadCode from "./components/UploadCode";
    import Marketplace from "./components/Marketplace";

    export default {
        name: 'App',
        components: {Marketplace, UploadCode}
    };
</script>

<style>
    #app {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
</style>
