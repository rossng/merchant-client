<template>
    <div id="account-list">
        <h3>Accounts</h3>
        <b-button @click="refreshAccounts">Refresh</b-button>
        <ul>
            <li v-for="account in accounts">{{account}}: {{ balances[account] ? web3.utils.fromWei(balances[account], 'ether') : 'N/A' }} ETH
            </li>
        </ul>
        <b-form inline>
            <b-select v-model="newSelectedAccount" :options="accounts" placeholder="Select account" class="mr-2"/>
            <b-button @click="switchAccount">Switch to account</b-button>
        </b-form>
    </div>
</template>

<script>
    import {mapState, mapMutations} from 'vuex';

    export default {
        name: "AccountList",
        async beforeMount() {
            window.setInterval(this.refreshAccounts.bind(this), 2000);
        },
        data() {
            return {
                newSelectedAccount: this.selectedAccount,
                balances: {},
                web3: this.$web3,
            }
        },
        computed: {
            ...mapState('accounts', ['accounts', 'selectedAccount'])
        },
        methods: {
            ...mapMutations('accounts', ['updateAccounts', 'updateSelectedAccount']),
            async refreshAccounts() {
                const availableAccounts = await this.web3.eth.getAccounts();
                this.updateAccounts(availableAccounts);

                let vm = this;
                await Promise.all(availableAccounts.map(async (a) => {
                    vm.balances[a] = await this.web3.eth.getBalance(a);
                }));

                if (!availableAccounts.some(account => account === this.selectedAccount)) {
                    this.updateSelectedAccount(this.accounts[0]);
                    this.newSelectedAccount = this.accounts[0];
                }
            },
            switchAccount() {
                this.updateSelectedAccount(this.newSelectedAccount);
            }
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
