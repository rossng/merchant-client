<template>
    <div id="app">
        <h1>Merchant Client</h1>
        <DeployContract/>
        <TradeContractList/>
        <AccountList/>
        <Marketplace/>
    </div>
</template>

<script>
    import DeployContract from "./components/DeployContract";
    import AccountList from "./components/AccountList"
    import Marketplace from "./components/Marketplace";
    import TradeContractList from "./components/TradeContractList";

    export default {
        name: 'App',
        components: {TradeContractList, Marketplace, DeployContract, AccountList}
    };
</script>

<style>
    #app {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
</style>
