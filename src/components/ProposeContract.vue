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
        props: ['contractAddress'],
        data() {
            return {
                marketplaceContract: new this.$web3.eth.Contract([{"constant":true,"inputs":[{"name":"contractAddress","type":"address"}],"name":"signed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"contracts_","outputs":[{"name":"counterparty","type":"address"},{"name":"holder","type":"address"},{"name":"signed","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"commodity","type":"uint8"},{"name":"quantity","type":"uint256"}],"name":"award","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newContract","type":"address"}],"name":"delegate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"balances_","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"commodity","type":"uint8"},{"name":"quantity","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner_","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"contractAddress","type":"address"},{"name":"to","type":"address"}],"name":"propose","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"commodity","type":"uint8"},{"name":"quantity","type":"uint256"}],"name":"receive","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"contractAddress","type":"address"}],"name":"sign","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]),
                to: null,
                web3: this.$web3,
            }
        },
        computed: {
            ...mapState('marketplace', ['marketplaceAddress']),
        },
        methods: {
            async proposeContract() {
                let self = this;
                this.marketplaceContract.methods.propose(this.contractAddress, this.to).send({
                    from: await this.web3.eth.getCoinbase(),
                    gas: 100000,
                    gasPrice: '20000000000'
                }).on('error', function (error) {
                    console.log('Error: ' + error);
                }).then((transactionHash) => {
                    console.log(`Proposed ${self.contractAddress} to ${self.to}`);
                });
            }
        }
    }
</script>

<style scoped>

</style>
