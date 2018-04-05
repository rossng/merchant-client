<template>
    <b-card header="Contract" header-tag="header" :footer="contractId" footer-tag="footer"
            :title="tradeMContractDeployable.contractInterface.name" style="max-width: 30rem;">

        <b-button v-if="!tradeMContractAddress" @click="deployTradeMContract">Deploy</b-button>
        <b-button v-else v-clipboard:copy="tradeMContractAddress">
            Deployed
            <b-badge variant="light">{{tradeMContractAddress}}</b-badge>
        </b-button>

        <ProposeContract :contract-id="this.contractId"></ProposeContract>
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
    import ProposeContract from "./ProposeContract";
    //import ProceedContract from "./ProceedContract";
    //import {Web3Utils, MContractInterface, MContractDeployable} from "../assets/web3-utils";

    export default {
        name: 'TradeContract',
        components: {ProposeContract},
        props: ['contract-id'],
        data() {
            return {
                file: null,
                web3: this.$web3,
                web3Utils: this.$web3Utils
            }
        },
        computed: {
            ...mapState('tradeMContracts', ['tradeMContractDeployables', 'tradeMContractInstanceAddresses']),
            ...mapState('tradeContracts', ['tradeContracts']),
            ...mapState('marketplace', ['marketplaceAddress']),
            haveFile() {
                return Boolean(this.file);
            },
            tradeMContractDeployable() {
                return this.tradeMContractDeployables.find((c) => this.contractId === c.contractInterface.id);
            },
            tradeMContractAddress() {
                return this.tradeMContractInstanceAddresses.find((c) => this.contractId === c.id).address;
            }
        },
        methods: {
            ...mapGetters('tradeMContracts', {
                getTradeMContractInterface: 'getById',
                getTradeMContractInstanceAddress: 'getAddressById'
            }),
            ...mapMutations('tradeMContracts', {
                addTradeMContractAddress: 'addAddress'
            }),
            ...mapMutations('tradeContracts', {
                addTradeContract: 'add',
            }),
            async getAccount() {
                let accounts = await this.web3.eth.getAccounts();
                console.log(`Current accounts: ${accounts}`);
                return accounts[0];
            },
            async deployTradeMContract() {
                let account = await this.getAccount();
                let vm = this;
                let tradeMContract = this.tradeMContractDeployable;
                let tradeContract = this.web3Utils.makeContractDeployable(tradeMContract);
                console.log(`Starting deployment of ${tradeMContract.contractInterface.id}`);
                tradeContract.deploy({
                    data: tradeContract.options.data,
                    arguments: [this.marketplaceAddress]
                }).send({
                    from: account,
                    gas: 5000000,
                    gasPrice: '20000000000'
                }).on('error', (err) => {
                    console.error(err);
                }).then((contractInstance) => {
                    console.log(`New MContract ${tradeMContract.contractInterface.name} deployed to ${contractInstance.options.address}`);
                    vm.addTradeMContractAddress({
                        id: tradeMContract.contractInterface.id,
                        address: contractInstance.options.address
                    });
                    vm.addTradeContract({id: tradeMContract.contractInterface.id, contract: contractInstance});
                    // TODO: add delegation
                    vm.$forceUpdate();
                });
            }
        }
    }
</script>

<style scoped>

</style>
