<template>
    <div id="app">
        <h1>Merchant Client</h1>
        <UploadContractPackage/>
        <TradeContractList/>
        <AccountList/>
        <Marketplace/>
        <Observables/>
    </div>
</template>

<script>
    import UploadContractPackage from "./components/UploadContractPackage";
    import AccountList from "./components/AccountList"
    import Marketplace from "./components/Marketplace";
    import TradeContractList from "./components/TradeContractList";
    import Observables from "./components/Observables";

    export default {
        name: 'App',
        components: {Observables, TradeContractList, Marketplace, UploadContractPackage, AccountList}
    };
</script>

<style>
    #app {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
</style>
