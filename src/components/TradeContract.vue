<template>
        <b-card :header="tradeMContractAddress" header-tag="header" :footer="contractId" footer-tag="footer"
                :title="tradeMContractInterface.name" style="max-width: 20rem;">
            <p class="card-text">A contract</p>
        </b-card>
    <!--<p v-if="manifest.proposed">Proposed</p>
    <p v-if="manifest.signed">Signed</p>
    <p class="card-text">{{(manifest.deployedContract &&
        manifest.deployedContract.options.address) || 'Not deployed'}}</p>
    <!--<ProposeContract v-if="manifest.deployedContract"
                     :contract-address="manifest.deployedContract.options.address"/>
    <ProceedContract v-if="manifest.deployedContract"
                     :contract-address="manifest.deployedContract.options.address"/>-->
</template>

<script>
    import {mapState, mapMutations, mapGetters} from 'vuex';
    //import ProposeContract from "./ProposeContract";
    //import ProceedContract from "./ProceedContract";
    //import {Web3Utils, MContractInterface, MContractDeployable} from "../assets/web3-utils";

    export default {
        name: 'TradeContract',
        //components: {ProceedContract, ProposeContract},
        props: ['contract-id'],
        data() {
            return {
                file: null,
                web3: this.$web3,
                web3Utils: this.$web3Utils
            }
        },
        computed: {
            ...mapState('tradeMContracts', ['tradeMContractInterfaces', 'tradeMContractInstanceAddresses']),
            ...mapState('tradeContracts', ['tradeContracts']),
            ...mapState('marketplace', ['marketplaceAddress']),
            haveFile() {
                return Boolean(this.file);
            },
            tradeMContractInterface() {
                return this.tradeMContractInterfaces.find(c => this.contractId === c.id);
            },
            tradeMContractAddress() {
                return this.tradeMContractInstanceAddresses.find(c => this.contractId === c.id);
            }
        },
        methods: {
            ...mapGetters('tradeMContracts', {
                getTradeMContractInterface: 'getById',
                getTradeMContractInstanceAddress: 'getAddressById'
            }),
            deployTradeMContract() {
                let vm = this;
                let tradeContract = this.web3Utils.makeContractDeployable(deployableContract);
                tradeContract.deploy({arguments: [this.marketplaceAddress]}).send({
                    from: account,
                    gas: 5000000,
                    gasPrice: '20000000000'
                }).on('error', console.error).then((contractInstance) => {
                    vm.addTradeMContractAddress({
                        id: deployableContract.contractInterface.id,
                        address: contractInstance.options.address
                    });
                    vm.addTradeContract({id: deployableContract.contractInterface.id, contract: contractInstance});
                    console.log(`New MContract ${deployableContract.contractInterface.name} deployed to ${contractInstance.options.address}`);
                    // TODO: add delegation
                    vm.$forceUpdate();
                });
            }
        }
    }
</script>

<style scoped>

</style>
