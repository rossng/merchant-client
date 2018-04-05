<template>
    <div class="deploy-contract">
        <b-button v-if="!tradeMContractAddress" @click="deployTradeMContract" variant="primary" v-b-tooltip.hover.rightbottom
                  :title="`As ${selectedAccount}`">Deploy
        </b-button>
        <div v-else>
            <b-button v-clipboard:copy="tradeMContractAddress" class="mb-2">
                Deployed
                <b-badge variant="light">{{tradeMContractAddress}}</b-badge>
            </b-button>
            <b-badge class="mt-2">Owned by {{tradeMContractOwner}}</b-badge>
        </div>
    </div>
</template>

<script>
    import {mapState, mapMutations} from 'vuex';

    export default {
        name: 'DeployContract',
        beforeMount() {
        },
        props: ['contract-id'],
        data() {
            return {
                web3: this.$web3,
                web3Utils: this.$web3Utils
            }
        },
        computed: {
            ...mapState('tradeMContracts', ['tradeMContractDeployables', 'tradeMContractInstances']),
            ...mapState('marketplace', ['marketplaceAddress']),
            ...mapState('accounts', ['selectedAccount']),
            tradeMContractAddress() {
                let instance = this.tradeMContractInstances.find((c) => this.contractId === c.id);
                if (instance) {
                    return instance.address;
                } else {
                    return null;
                }
            },
            tradeMContractOwner() {
                let instance = this.tradeMContractInstances.find((c) => this.contractId === c.id);
                if (instance) {
                    return instance.owner;
                } else {
                    return null;
                }
            },
            tradeMContractDeployable() {
                return this.tradeMContractDeployables.find((c) => this.contractId === c.contractInterface.id);
            }
        },
        methods: {
            ...mapMutations('tradeMContracts', {addTradeMContractInstance: 'addInstance'}),
            ...mapMutations('tradeContracts', {addTradeContract: 'add'}),
            marketplaceContract() {
                return this.web3Utils.getMarketplaceContract(this.marketplaceAddress);
            },
            async deployTradeMContract() {
                let account = this.selectedAccount;
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
                    vm.addTradeMContractInstance({
                        id: tradeMContract.contractInterface.id,
                        owner: account,
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
