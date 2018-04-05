<template>
    <b-card header="Contract" header-tag="header" :footer="contractId" footer-tag="footer"
            :title="tradeMContractDeployable.contractInterface.name" style="max-width: 30rem;">

        <DeployContract :contract-id="contractId"></DeployContract>
        <ProposeContract :contract-id="contractId"></ProposeContract>
        <SignContract :contract-id="contractId"></SignContract>
    </b-card>
</template>

<script>
    import {mapState, mapMutations, mapGetters} from 'vuex';
    import DeployContract from "./DeployContract";
    import ProposeContract from "./ProposeContract";
    import SignContract from "./SignContract"
    //import ProceedContract from "./ProceedContract";
    //import {Web3Utils, MContractInterface, MContractDeployable} from "../assets/web3-utils";

    export default {
        name: 'TradeContract',
        components: {ProposeContract, DeployContract, SignContract},
        props: ['contract-id'],
        data() {
            return {
                file: null,
                web3: this.$web3,
                web3Utils: this.$web3Utils
            }
        },
        computed: {
            ...mapState('tradeMContracts', ['tradeMContractDeployables', 'tradeMContractInstances']),
            ...mapState('tradeContracts', ['tradeContracts']),
            ...mapState('marketplace', ['marketplaceAddress']),
            ...mapState('accounts', ['selectedAccount']),
            haveFile() {
                return Boolean(this.file);
            },
            tradeMContractDeployable() {
                return this.tradeMContractDeployables.find((c) => this.contractId === c.contractInterface.id);
            }
        },
        methods: {
        }
    }
</script>

<style scoped>

</style>
