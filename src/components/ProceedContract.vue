<template>
    <div class="proceed-contract" v-if="isSigned">
        <b-button @click="proceedContract" class="mb-3">Proceed</b-button>
    </div>
</template>

<script>
    import {mapState, mapMutations} from 'vuex';

    export default {
        name: 'ProceedContract',
        beforeMount() {
            window.setInterval(this.refreshSignedStatus.bind(this), 4000);
        },
        props: ['contract-id'],
        data() {
            return {
                web3: this.$web3,
                web3Utils: this.$web3Utils
            }
        },
        computed: {
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
            isSigned() {
                return this.contractStatus !== null && this.contractStatus.signed;
            }
        },
        methods: {
            async proceedContract() {
                let contractAddress = this.contractAddress;
                this.contract.methods.proceed().send({
                    from: this.selectedAccount,
                    gas: 100000,
                    gasPrice: '20000000000'
                }).on('error', function (error) {
                    console.log('Error: ' + error);
                }).then((transactionHash) => {
                    console.log(`Proceeded ${contractAddress} (tx: ${transactionHash})`);
                })
            },
            async refreshSignedStatus() {
                if (this.tradeMContractAddress === null) {
                    this.contractStatus = null;
                    return;
                }
                this.contractStatus = await this.marketplaceContract().methods.contracts_(this.tradeMContractAddress).call();
            }
        }
    }
</script>

<style scoped>

</style>
