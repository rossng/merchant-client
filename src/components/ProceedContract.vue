<template>
    <div id="proceed-contract">
        <b-button @click="proceedContract" class="mb-3">Proceed</b-button>
    </div>
</template>

<script>
    import {mapState, mapMutations} from 'vuex';

    export default {
        name: "ProceedContract",
        beforeMount() {
            this.marketplaceContract.options.address = this.marketplaceAddress;
            this.contract.options.address = this.contractAddress;
        },
        props: ['contractAddress'],
        data() {
            return {
                contract: this.$baseContract.clone(),
                marketplaceContract: this.$marketplaceContract.clone(),
                web3: this.$web3
            }
        },
        computed: {
            ...mapState('marketplace', ['marketplaceAddress']),
        },
        methods: {
            async getAccount() {
                let accounts = await this.web3.eth.getAccounts();
                console.log(`Current accounts: ${accounts}`);
                return accounts[0];
            },
            async proceedContract() {
                let contractAddress = this.contractAddress;
                this.contract.methods.proceed().send({
                    from: await this.getAccount(),
                    gas: 100000,
                    gasPrice: '20000000000'
                }).on('error', function (error) {
                    console.log('Error: ' + error);
                }).then((transactionHash) => {
                    console.log(`Proceeded ${contractAddress} (tx: ${transactionHash})`);
                })
            }
        }
    }
</script>

<style scoped>

</style>
