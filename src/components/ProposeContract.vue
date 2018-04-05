<template>
    <b-form inline id="propose-contract" class="mt-3">
        <b-form-input v-model="toAddress" type="text" placeholder="To address" class="mr-2"></b-form-input>
        <b-button v-if="marketplaceAddress" @click="proposeContract">Propose</b-button>
        <div v-else v-b-tooltip.hover title="No marketplace deployed">
            <b-button disabled>Propose</b-button>
        </div>
    </b-form>
</template>

<script>
    import {mapState, mapMutations} from 'vuex';

    export default {
        name: "ProposeContract",
        beforeMount() {
        },
        props: ['contract-id'],
        data() {
            return {
                toAddress: null,
                web3: this.$web3,
                web3Utils: this.$web3Utils
            }
        },
        computed: {
            ...mapState('tradeMContracts', ['tradeMContractInstanceAddresses']),
            ...mapState('marketplace', ['marketplaceAddress']),
            tradeMContractAddress() {
                return this.tradeMContractInstanceAddresses.find((c) => this.contractId === c.id).address;
            }
        },
        methods: {
            marketplaceContract() {
                return this.web3Utils.getMarketplaceContract(this.marketplaceAddress);
            },
            async getAccount() {
                let accounts = await this.web3.eth.getAccounts();
                console.log(`Current accounts: ${accounts}`);
                return accounts[0];
            },
            async proposeContract() {
                let marketplace = this.marketplaceContract();
                if (marketplace.options.address === null) {
                    console.error('Marketplace is not currently deployed');
                    return;
                }
                let contractAddress = this.tradeMContractAddress;
                let toAddress = this.toAddress;
                marketplace.methods.propose(contractAddress, toAddress).send({
                    from: await this.getAccount(),
                    gas: 100000,
                    gasPrice: '20000000000'
                }).on('error', (err) => {
                    console.log('Error proposing contract: ' + err);
                }).then((txHash) => {
                    console.log(`Proposed ${contractAddress} to ${toAddress}`);
                });
            }
        }
    }
</script>

<style scoped>

</style>
