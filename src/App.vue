<template>
    <div id="app">
        <h1>Merchant Client</h1>
        <DeployContract/>
        <AccountList/>
        <Marketplace/>
    </div>
</template>

<script>
    import DeployContract from "./components/DeployContract";
    import AccountList from "./components/AccountList"
    import Marketplace from "./components/Marketplace";

    export default {
        name: 'App',
        components: {Marketplace, DeployContract, AccountList}
    };
</script>

<style>
    #app {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
</style>
