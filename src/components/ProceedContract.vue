<template>
    <div class="proceed-contract" v-if="isSigned && !isKilled">
        <b-button @click="proceedContract" class="mt-3" variant="primary">Proceed</b-button>
    </div>
</template>

<script>
    import {mapState, mapMutations} from 'vuex';

    export default {
        name: 'ProceedContract',
        beforeMount() {
            this.refreshSignedStatus();
            window.setInterval(this.refreshSignedStatus.bind(this), 4000);
            // Poll aliveness infrequently because we rely on the event instead
            this.refreshAliveStatus();
            window.setInterval(this.refreshAliveStatus.bind(this), 15000);
        },
        props: ['contract-id'],
        data() {
            return {
                contractStatus: null,
                web3: this.$web3,
                web3Utils: this.$web3Utils
            }
        },
        computed: {
            ...mapState('tradeMContracts', ['tradeMContractInterfaces', 'tradeMContractInstances', 'tradeMContractInstanceKills']),
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
            isSigned() {
                return this.contractStatus !== null && this.contractStatus.signed;
            },
            isKilled() {
                return this.tradeMContractInstanceKills.some((c) => this.contractId === c.id);
            }
        },
        methods: {
            ...mapMutations('tradeMContracts', {
                killTradeMContractInstance: 'killInstance'
            }),
            marketplaceContract() {
                return this.web3Utils.getMarketplaceContract(this.marketplaceAddress);
            },
            async proceedContract() {
                let contractInterface = this.tradeMContractInterface;
                let contract = this.web3Utils.makeContractInstance(contractInterface, this.tradeMContractAddress);
                contract.methods.proceed().send({
                    from: this.selectedAccount,
                    gas: 2000000,
                    gasPrice: '20000000000'
                }).on('error', function (error) {
                    console.log('Error: ' + error);
                }).then((receipt) => {
                    console.log(`Proceeded ${this.contractId} (tx: ${receipt.transactionHash})`);
                    this.refreshAliveStatus();
                    this.$forceUpdate();
                })
            },
            async refreshSignedStatus() {
                if (this.tradeMContractAddress === null) {
                    this.contractStatus = null;
                    return;
                }
                this.contractStatus = await this.marketplaceContract().methods.contracts_(this.tradeMContractAddress).call();
            },
            async refreshAliveStatus() {
                if (this.tradeMContractAddress === null || this.isKilled) {
                    return;
                }
                let contract = this.web3Utils.makeContractInstance(this.tradeMContractInterface, this.tradeMContractAddress);
                if (!(await contract.methods.alive_().call())) {
                    // TODO: re-enable?
                    //this.killTradeMContractInstance({id: this.contractId});
                }
            }
        }
    }
</script>

<style scoped>

</style>
