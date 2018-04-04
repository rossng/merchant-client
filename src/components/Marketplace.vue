<template>
    <div id="marketplace">
        <h2>Marketplace</h2>
        <h3>Marketplace deployment</h3>
        <!--<b-form-input v-model="newMarketplaceAddress" type="text" class="mb-3"
                      placeholder="Enter the marketplace address"></b-form-input>
        <b-button @click="setMarketplaceAddress(newMarketplaceAddress)">Update Marketplace Address</b-button>-->
        <p>Current marketplace: {{marketplaceAddress}}</p>
        <b-button @click="deployMarketplace">Redeploy Marketplace</b-button>

        <h3>Balance query</h3>
        <b-form inline>
            <b-input v-model="balanceQuery.address" type="text" placeholder="User address"
                     class="mb-2 mr-sm-2 mb-sm-0"></b-input>
            <b-form-select v-model="balanceQuery.currency" :options="currencies"
                           class="mb-2 mr-sm-2 mb-sm-0"></b-form-select>
            <b-button @click="getBalance">Get Balance</b-button>
        </b-form>
        <p>Balance: {{balanceResult}}</p>

        <h3>Award</h3>
        <b-form inline>
            <b-input v-model="awardQuery.address" type="text" placeholder="Transfer to address"
                     class="mb-2 mr-sm-2 mb-sm-0"></b-input>
            <b-input v-model="awardQuery.quantity" type="number" placeholder="Transfer quantity"
                     class="mb-2 mr-sm-2 mb-sm-0"></b-input>
            <b-form-select v-model="awardQuery.currency" :options="currencies" placeholder="Currency"
                           class="mb-2 mr-sm-2 mb-sm-0"></b-form-select>
            <b-button @click="doAward">Award</b-button>
        </b-form>

        <h3>Inspect contract</h3>
        <b-form inline>
            <b-input v-model="inspectQuery.address" placeholder="Contract address"
                     class="mb-2 mr-sm-2 mb-sm-0"></b-input>
            <b-button @click="doInspect">Inspect</b-button>
        </b-form>
        <h4>Contract</h4>
        <ul>
            <li>Counterparty: {{inspectResult.counterparty}}</li>
            <li>Holder: {{inspectResult.holder}}</li>
            <li>Signed: {{inspectResult.signed}}</li>
        </ul>

        <h3>Sign contract</h3>
        <b-form inline>
            <b-input v-model="signQuery.address" placeholder="Contract address" class="mb-2 mr-sm-2 mb-sm-0"></b-input>
            <b-button @click="doSign">Sign</b-button>
        </b-form>
    </div>
</template>

<script>
    import {mapState, mapMutations} from 'vuex';

    export default {
        name: "Marketplace",
        beforeMount() {
            this.marketplaceContract.options.address = this.marketplaceAddress;
            //setInterval(this.updateEvents.bind(self), 5000);
        },
        data() {
            return {
                currencies: [
                    {value: 0, text: 'USD'},
                    {value: 1, text: 'GBP'}
                ],
                balanceQuery: {
                    address: null,
                    currency: null
                },
                inspectQuery: {
                    address: null
                },
                inspectResult: {
                    holder: null,
                    counterparty: null,
                    signed: null
                },
                signQuery: {
                    address: null
                },
                balanceResult: null,
                marketplaceContract: this.$marketplaceContract.clone(),
                newMarketplaceAddress: this.marketplaceAddress,
                awardQuery: {
                    address: null,
                    quantity: null,
                    currency: null
                },
                web3: this.$web3,
            }
        },
        computed: {
            ...mapState('marketplace', ['marketplaceAddress']),
        },
        methods: {
            ...mapMutations('marketplace', ['setMarketplaceAddress']),
            async getAccount() {
                let accounts = await this.web3.eth.getAccounts();
                console.log(`Current accounts: ${accounts}`);
                return accounts[0];
            },
            async deployMarketplace() {
                let account = await this.getAccount();
                console.log(`Deploying marketplace from ${account}`);
                let self = this;

                this.marketplaceContract.deploy({
                    arguments: [],
                }).send({
                    from: account,
                    gas: 2000000,
                    gasPrice: '20000000000'
                }).on('error', function (error) {
                    console.log('Error: ' + error);
                }).on('transactionHash', function (transactionHash) {
                    console.log('Transaction hash: ' + transactionHash);
                }).on('receipt', function (receipt) {
                    console.log('Receipt: ' + receipt.contractAddress) // contains the new contract address
                }).on('confirmation', function (confirmationNumber, receipt) {
                    //console.log(`Confirmation: ${confirmationNumber} for marketplace deployment`)
                }).then((newContractInstance) => {
                    console.log(`New marketplace instance address: ${newContractInstance.options.address}`); // instance with the new contract address
                    self.setMarketplaceAddress(newContractInstance.options.address);
                    self.marketplaceContract = newContractInstance;

                    //setInterval(self.updateEvents.bind(self), 5000);

                    /*self.marketplaceContract.events.Proposed().on('data', evt => {
                        console.log('Event: contract proposed');
                        //self.proposeManifest({id: manifest.id, proposed: true});
                    });*/
                });
            },
            async getBalance() {
                this.balanceResult = await this.marketplaceContract.methods.balances_(
                    this.balanceQuery.address, this.balanceQuery.currency).call();
            },
            async updateEvents() {
                this.marketplaceContract.getPastEvents('Proposed')
                    .on('data', console.log)
                    .on('error', console.error);
            },
            async doAward() {
                this.marketplaceContract.methods.award(this.awardQuery.address, this.awardQuery.currency, this.awardQuery.quantity).send({
                    from: await this.getAccount(),
                    gas: 100000,
                    gasPrice: '20000000000'
                }).on('error', function (error) {
                    console.log('Error: ' + error);
                }).then((transactionHash) => {
                    console.log(`Award complete (${transactionHash})`);
                });
            },
            async doInspect() {
                this.inspectResult = await this.marketplaceContract.methods.contracts_(this.inspectQuery.address).call();
            },
            async doSign() {
                let contractAddress = this.signQuery.address;
                this.marketplaceContract.methods.sign(contractAddress).send({
                    from: await this.getAccount(),
                    gas: 100000,
                    gasPRice: '20000000000'
                }).on('error', function (error) {
                    console.log('Error: ' + error);
                }).then((transactionHash) => {
                    console.log(`Signed ${contractAddress} (${transactionHash})`);
                })
            }
        }
    }
</script>

<style scoped>
    #marketplace {
        border: 1px solid grey;
        margin: 10px;
        padding: 10px;
    }
</style>
