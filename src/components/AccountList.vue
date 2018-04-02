<template>
    <div id="account-list">
        <h3>Accounts</h3>
        <b-button @click="refreshAccounts">Refresh</b-button>
        <ul>
            <li v-for="account in accounts">{{account.address}}: {{web3.utils.fromWei(account.balance, 'ether')}} ETH
            </li>
        </ul>
    </div>
</template>

<script>
    import {mapState, mapMutations} from 'vuex';

    export default {
        name: "AccountList",
        beforeMount() {
            this.refreshAccounts();
        },
        data() {
            return {
                web3: this.$web3,
            }
        },
        computed: {
            ...mapState('accounts', ['accounts'])
        },
        methods: {
            ...mapMutations('accounts', ['updateAccounts']),
            async refreshAccounts() {
                const addresses = await this.web3.eth.getAccounts();
                this.updateAccounts(await Promise.all(addresses.map(async (a) => ({
                    address: a,
                    balance: await this.web3.eth.getBalance(a)
                }))));
            },
        }
    }
</script>

<style scoped>
    #account-list {
        border: 1px solid grey;
        margin: 10px;
        padding: 10px;
    }
</style>
