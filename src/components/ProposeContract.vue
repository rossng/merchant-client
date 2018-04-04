<template>
    <div id="propose-contract">
        <b-form-input v-model="to" type="text" placeholder="To address" class="mb-3"></b-form-input>
        <b-button @click="proposeContract" class="mb-3">Propose</b-button>
    </div>
</template>

<script>
    import {mapState, mapMutations} from 'vuex';

    export default {
        name: "ProposeContract",
        beforeMount() {
            this.marketplaceContract.options.address = this.marketplaceAddress;
        },
        props: ['contract-id'],
        data() {
            return {
                marketplaceContract: this.$marketplaceContract.clone(),
                to: null,
                web3: this.$web3,
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
            async proposeContract() {
                let contractAddress = this.contractAddress;
                let to = this.to;
                this.marketplaceContract.methods.propose(contractAddress, to).send({
                    from: await this.getAccount(),
                    gas: 100000,
                    gasPrice: '20000000000'
                }).on('error', function (error) {
                    console.log('Error: ' + error);
                }).then((transactionHash) => {
                    console.log(`Proposed ${contractAddress} to ${to} (tx: ${transactionHash})`);
                });
            }
        }
    }
</script>

<style scoped>

</style>
