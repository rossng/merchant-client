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
        <b-form-input v-model="balanceAddress" type="text" placeholder="User address" class="mb-3"></b-form-input>
        <b-form-select v-model="balanceCurrency" :options="currencies" class="mb-3"></b-form-select>
        <b-button @click="getBalance">Get Balance</b-button>
        <p>Balance: {{balance}}</p>

        <h3>Award</h3>
        <b-form-input v-model="award.address" type="text" placeholder="Transfer to address"
                      class="mb-3"></b-form-input>
        <b-form-input v-model="award.quantity" type="number" placeholder="Transfer quantity"
                      class="mb-3"></b-form-input>
        <b-form-select v-model="award.currency" :options="currencies" class="mb-3"></b-form-select>
        <b-button @click="doAward">Award</b-button>
    </div>
</template>

<script>
    import {mapState, mapMutations} from 'vuex';

    export default {
        name: "Marketplace",
        beforeMount() {
            this.marketplaceContract.options.address = this.marketplaceAddress;
        },
        data() {
            return {
                currencies: [
                    {value: 0, text: 'USD'},
                    {value: 1, text: 'GBP'}
                ],
                balanceAddress: null,
                balanceCurrency: null,
                balance: null,
                marketplaceContract: new this.$web3.eth.Contract([{"constant":true,"inputs":[{"name":"contractAddress","type":"address"}],"name":"signed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"contracts_","outputs":[{"name":"counterparty","type":"address"},{"name":"holder","type":"address"},{"name":"signed","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"commodity","type":"uint8"},{"name":"quantity","type":"uint256"}],"name":"award","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newContract","type":"address"}],"name":"delegate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"balances_","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"commodity","type":"uint8"},{"name":"quantity","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner_","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"contractAddress","type":"address"},{"name":"to","type":"address"}],"name":"propose","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"commodity","type":"uint8"},{"name":"quantity","type":"uint256"}],"name":"receive","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"contractAddress","type":"address"}],"name":"sign","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]),
                newMarketplaceAddress: this.marketplaceAddress || "0xBFF10BE69071Af19bc9Db32aD45616BDF864AF3d",
                award: {
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
            async deployMarketplace() {
                let coinbase = await this.web3.eth.getCoinbase();
                console.log(`Deploying marketplace from ${coinbase}`);
                let self = this;

                this.marketplaceContract.deploy({
                    arguments: [],
                    data: "0x6060604052341561000f57600080fd5b6000600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600080600181111561005e57fe5b8152602001908152602001600020819055506000600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006001808111156100bf57fe5b815260200190815260200160002081905550336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610e1b806101206000396000f3006060604052600436106100a4576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680630555ff41146100a957806349b20a90146100fa5780634f04667e146101b15780635c19a95c146101ff5780636e11431014610238578063709044831461028e578063e7663079146102dc578063e8f1586414610331578063e9c3f59214610389578063f71be837146103b8575b600080fd5b34156100b457600080fd5b6100e0600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506103f1565b604051808215151515815260200191505060405180910390f35b341561010557600080fd5b610131600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190505061044a565b604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182151515158152602001935050505060405180910390f35b34156101bc57600080fd5b6101fd600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803560ff169060200190919080359060200190919050506104c1565b005b341561020a57600080fd5b610236600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190505061058a565b005b341561024357600080fd5b610278600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919080359060200190919050506107ee565b6040518082815260200191505060405180910390f35b341561029957600080fd5b6102da600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803560ff16906020019091908035906020019091905050610813565b005b34156102e757600080fd5b6102ef610954565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561033c57600080fd5b610387600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610979565b005b341561039457600080fd5b6103b6600480803560ff16906020019091908035906020019091905050610b14565b005b34156103c357600080fd5b6103ef600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610c9a565b005b6000600160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160149054906101000a900460ff169050919050565b60016020528060005260406000206000915090508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060010160149054906101000a900460ff16905083565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561051c57600080fd5b80600260008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600084600181111561056a57fe5b815260200190815260200160002060008282540192505081905550505050565b60011515600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160149054906101000a900460ff1615151415156105ec57600080fd5b606060405190810160405280600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200160011515815250600160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060408201518160010160146101000a81548160ff02191690831515021790555090505050565b6002602052816000526040600020602052806000526040600020600091509150505481565b80600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600084600181111561086157fe5b8152602001908152602001600020541015151561087d57600080fd5b80600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008460018111156108cb57fe5b81526020019081526020016000206000828254039250508190555080600260008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600084600181111561093457fe5b815260200190815260200160002060008282540192505081905550505050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160149054906101000a900460ff161515156109d557600080fd5b6060604051908101604052803373ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff16815260200160001515815250600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060408201518160010160146101000a81548160ff0219169083151502179055509050505050565b6000600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000209050600115158160010160149054906101000a900460ff161515141515610b7b57600080fd5b81600260008360000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000856001811115610bed57fe5b81526020019081526020016000206000828254039250508190555081600260008360010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000856001811115610c7a57fe5b815260200190815260200160002060008282540192505081905550505050565b600160008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610d3657600080fd5b600160008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160149054906101000a900460ff16151515610d9257600080fd5b60018060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160146101000a81548160ff021916908315150217905550505600a165627a7a72305820df4e6ef36303b3b12c8a9ad074eeb55275b37578e3ba1998d1ae4dba607f770f0029",
                }).send({
                    from: coinbase,
                    gas: 2000000,
                    gasPrice: '20000000000'
                }).on('error', function (error) {
                    console.log('Error: ' + error);
                }).on('transactionHash', function (transactionHash) {
                    console.log('Transaction hash: ' + transactionHash);
                }).on('receipt', function (receipt) {
                    console.log('Receipt: ' + receipt.contractAddress) // contains the new contract address
                }).on('confirmation', function (confirmationNumber, receipt) {
                    console.log(`Confirmation: ${confirmationNumber} for marketplace deployment`)
                }).then((newContractInstance) => {
                    console.log(`New marketplace instance address: ${newContractInstance.options.address}`); // instance with the new contract address
                    self.setMarketplaceAddress(newContractInstance.options.address);
                    this.marketplaceContract = newContractInstance;
                });
            },
            async getBalance() {
                this.balance = await this.marketplaceContract.methods.balances_(
                    this.balanceAddress, this.balanceCurrency).call();
            },
            async doAward() {
                this.marketplaceContract.methods.award(this.award.address, this.award.currency, this.award.quantity).send({
                    from: await this.web3.eth.getCoinbase(),
                    gas: 100000,
                    gasPrice: '20000000000'
                }).on('error', function (error) {
                    console.log('Error: ' + error);
                }).then((transactionHash) => {
                    console.log(`Award complete (${transactionHash})`);
                });
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
