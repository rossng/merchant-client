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
            ...mapState('tradeMContracts', ['tradeMContractInstances', 'tradeMContractDeployables', 'tradeMContractInstanceKills']),
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
                let contract = this.web3Utils.makeContractInstance(this.tradeMContractDeployable.contractInterface, this.tradeMContractAddress);
                contract.methods.proceed().send({
                    from: this.selectedAccount,
                    gas: 500000,
                    gasPrice: '20000000000'
                }).on('error', function (error) {
                    console.log('Error: ' + error);
                }).then((transactionHash) => {
                    console.log(`Proceeded ${this.contractId} (tx: ${transactionHash})`);
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
                let contract = this.web3Utils.makeContractInstance(this.tradeMContractDeployable.contractInterface, this.tradeMContractAddress);
                if (!(await contract.methods.alive_().call())) {
                    this.killTradeMContractInstance({id: this.contractId});
                }
            }
        }
    }
</script>

<style scoped>

</style>
