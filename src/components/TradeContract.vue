<template>
    <b-card :header="isKilled ? 'Completed contract' : 'Alive contract'" header-tag="header"
            :footer="`id: ${contractId}`" footer-tag="footer"
            :title="tradeMContractInterface.name" style="max-width: 30rem; min-width: 30rem;"
            :bg-variant="isKilled ? 'secondary' : 'default'" :text-variant="isKilled ? 'light' : 'dark'"
            class="mb-2">

        <p v-if="isKilled">{{killReason}}</p>

        <DeployContract :contract-id="contractId"></DeployContract>
        <ProposeContract :contract-id="contractId"></ProposeContract>
        <SignContract :contract-id="contractId"></SignContract>
        <ProceedContract :contract-id="contractId"></ProceedContract>
    </b-card>
</template>

<script>
    import {mapState, mapMutations, mapGetters} from 'vuex';
    import DeployContract from "./DeployContract";
    import ProposeContract from "./ProposeContract";
    import SignContract from "./SignContract"
    import ProceedContract from "./ProceedContract";

    export default {
        name: 'TradeContract',
        components: {ProposeContract, DeployContract, SignContract, ProceedContract},
        props: ['contract-id'],
        data() {
            return {
                file: null,
                web3: this.$web3,
                web3Utils: this.$web3Utils
            }
        },
        computed: {
            ...mapState('tradeMContracts', ['tradeMContractInterfaces', 'tradeMContractInstances', 'tradeMContractInstanceKills']),
            ...mapState('tradeContracts', ['tradeContracts']),
            ...mapState('marketplace', ['marketplaceAddress']),
            ...mapState('accounts', ['selectedAccount']),
            haveFile() {
                return Boolean(this.file);
            },
            tradeMContractInterface() {
                return this.tradeMContractInterfaces.find((c) => this.contractId === c.id);
            },
            isKilled() {
                return this.tradeMContractInstanceKills.some((c) => this.contractId === c.id);
            },
            killReason() {
                let instance = this.tradeMContractInstanceKills.find((c) => this.contractId === c.id);
                if (instance) {
                    return instance.killReason;
                } else {
                    return null;
                }
            }
        },
        methods: {}
    }
</script>

<style scoped>

</style>
