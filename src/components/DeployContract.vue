<template>
    <div class="deploy-contract">
        <div v-if="!tradeMContractBinary && !tradeMContractAddress" v-b-tooltip.hover.rightbottom
             title="No binary available">
            <b-button disabled variant="primary"></b-button>
        </div>
        <b-button v-else-if="!tradeMContractAddress" @click="deployTradeMContract" variant="primary"
                  v-b-tooltip.hover.rightbottom
                  :title="`As ${selectedAccount}`">Deploy
        </b-button>
        <div v-else>
            <b-button size="sm" v-clipboard:copy="tradeMContractAddress" class="mb-2">
                Deployed
                <b-badge variant="light">{{tradeMContractAddress}}</b-badge>
            </b-button>
            <b-badge class="mt-2">Created by {{tradeMContractCreator}}</b-badge>
        </div>
    </div>
</template>

<script>
    import {mapState, mapMutations} from 'vuex';
    import {Web3Utils} from "../assets/web3-utils";

    export default {
        name: 'DeployContract',
        beforeMount() {
            this.getPastDelegations();
            this.getPastKills();
            if (this.tradeMContractAddress !== null) {
                let contractInstance = this.web3Utils.makeContractInstance(this.tradeMContractInterface, this.tradeMContractAddress);
                this.subscribeToKills(contractInstance, this.tradeMContractInterface, this);
                this.subscribeToDelegations(contractInstance, this);
            }
        },
        props: ['contract-id'],
        data() {
            return {
                web3: this.$web3,
                web3Utils: this.$web3Utils
            }
        },
        computed: {
            ...mapState('tradeMContracts', ['tradeMContractInterfaces', 'tradeMContractBinaries', 'tradeMContractInstances']),
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
            tradeMContractCreator() {
                let instance = this.tradeMContractInstances.find((c) => this.contractId === c.id);
                if (instance) {
                    return instance.creator;
                } else {
                    return null;
                }
            },
            tradeMContractInterface() {
                return this.tradeMContractInterfaces.find((c) => this.contractId === c.id);
            },
            tradeMContractBinary() {
                let instance = this.tradeMContractBinaries.find((c) => this.contractId === c.id);
                if (instance) {
                    return instance.bin;
                } else {
                    return null;
                }
            }
        },
        methods: {
            ...mapMutations('tradeMContracts', {
                addTradeMContractInstance: 'addInstance',
                addTradeMContractInterface: 'addInterface',
                killTradeMContractInstance: 'killInstance'
            }),
            ...mapMutations('tradeContracts', {addTradeContract: 'add'}),
            marketplaceContract() {
                return this.web3Utils.getMarketplaceContract(this.marketplaceAddress);
            },
            async deployTradeMContract() {
                let account = this.selectedAccount;
                let vm = this;
                let contractInterface = this.tradeMContractInterface;
                let tradeContract = this.web3Utils.makeContract(contractInterface, this.tradeMContractBinary);
                console.log(`Starting deployment of ${contractInterface.id}`);
                tradeContract.deploy({
                    data: tradeContract.options.data,
                    arguments: [this.marketplaceAddress]
                }).send({
                    from: account,
                    gas: 2700000,
                    gasPrice: '20000000000'
                }).on('error', (err) => {
                    console.error(err);
                }).then((contractInstance) => {
                    console.log(`New MContract ${contractInterface.name} deployed to ${contractInstance.options.address}`);
                    vm.addTradeMContractInstance({
                        id: contractInterface.id,
                        creator: account,
                        address: contractInstance.options.address
                    });
                    vm.addTradeContract({id: contractInterface.id, contract: contractInstance});
                    vm.subscribeToKills(contractInstance, contractInterface, vm);
                    vm.subscribeToDelegations(contractInstance, vm);
                    vm.$forceUpdate();
                });
            },
            subscribeToKills(contractInstance, contractInterface, vm) {
                if (!vm.$usingMetaMask) {
                    contractInstance.events.Killed({
                        filter: {},
                        fromBlock: 0
                    }, function (error, event) {
                        if (error !== null) {
                            console.error(error);
                            return;
                        }
                        vm.killTradeMContractInstance({
                            id: contractInterface.id,
                            reason: event.returnValues.killReason
                        });
                        console.log(`Killed instance of ${contractInterface.id} at ${contractInstance.options.address}`);
                    });
                }
            },
            subscribeToDelegations(contractInstance, vm) {
                if (!vm.$usingMetaMask) {
                    vm.marketplaceContract().events.Delegated({
                        filter: {from: contractInstance.options.address},
                        fromBlock: 0
                    }, function (error, event) {
                        if (error !== null) {
                            console.error(error);
                            return;
                        }
                        vm.addDelegatedContract(event.returnValues);
                    });
                }
            },
            getPastDelegations() {
                if (this.tradeMContractAddress === null) {
                    return;
                }
                console.log(`Update delegations for ${this.tradeMContractAddress}`);
                let vm = this;
                this.marketplaceContract().getPastEvents('Delegated', {
                    filter: {from: this.tradeMContractAddress},
                    fromBlock: 0
                }, function (error, events) {
                    if (error !== null) {
                        console.error(error);
                        return;
                    }
                    if (events === []) {
                        console.log('No events');
                    }
                    events.forEach(function (event) {
                        console.log('Got event');
                        vm.addDelegatedContract(event.returnValues)
                    }.bind(vm));
                    vm.$forceUpdate();
                });
            },
            getPastKills() {
                let vm = this;
                if (vm.tradeMContractAddress === null) {
                    return;
                }
                console.log(`Get past kills for ${vm.tradeMContractAddress}`);
                let contractInstance = vm.web3Utils.makeContractInstance(vm.tradeMContractInterface, vm.tradeMContractAddress);
                contractInstance.getPastEvents('Killed', {
                    filter: {},
                    fromBlock: 0
                }, function (error, events) {
                    if (error !== null) {
                        console.error(error);
                        return;
                    }
                    events.forEach(function (event) {
                        this.killTradeMContractInstance({
                            id: this.tradeMContractInterface.id,
                            reason: event.returnValues.killReason
                        });
                        console.log(`Killed instance of ${this.tradeMContractInterface.id} at ${contractInstance.options.address}`);
                    }.bind(vm));
                    vm.$forceUpdate();
                });
            },
            addDelegatedContract(eventValues) {
                let newAddress = eventValues.to;
                console.log(`Adding new delegated contract at ${newAddress}`);
                if (this.tradeMContractInstances.some(instance => instance.address === newAddress)) {
                    console.log(`Contract at ${newAddress} already has instance, won't re-add`);
                    return;
                }
                let newInterface = Web3Utils.makeDelegatedInterface(this.tradeMContractInterface.name);
                this.addTradeMContractInterface(newInterface);
                this.addTradeMContractInstance({
                    id: newInterface.id,
                    creator: this.tradeMContractAddress,
                    address: newAddress
                });
            }
        }
    }
</script>

<style scoped>

</style>
