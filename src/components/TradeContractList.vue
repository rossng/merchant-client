<template>
    <div id="trade-contract-list">
        <h2>Trades</h2>

        <b-button @click="reset">Remove all contracts</b-button>

        <b-card-group deck class="mt-3">
            <TradeContract v-for="contract in tradeMContractInterfaces" :key="contract.id"
                           :contract-id="contract.id"></TradeContract>
        </b-card-group>
    </div>
</template>

<script>
    import {mapState, mapMutations, mapGetters} from 'vuex';
    import TradeContract from './TradeContract';

    export default {
        name: 'TradeContractList',
        components: {TradeContract},
        data() {
            return {
                file: null,
                web3: this.$web3,
                web3Utils: this.$web3Utils
            }
        },
        computed: {
            ...mapState('tradeMContracts', ['tradeMContractInterfaces', 'tradeMContractBinaries', 'tradeMContractInstances']),
            ...mapState('tradeContracts', ['tradeContracts']),
            ...mapState('marketplace', ['marketplaceAddress'])
        },
        methods: {
            ...mapMutations('tradeMContracts', {
                resetTradeMContracts: 'reset'
            }),
            ...mapMutations('tradeContracts', {
                resetTradeContracts: 'reset'
            }),
            reset() {
                this.resetTradeMContracts();
                this.resetTradeContracts();
            },
        }
    }
</script>

<style scoped>
    #trade-contract-list {
        border: 1px solid grey;
        margin: 10px;
        padding: 10px;
    }
</style>
