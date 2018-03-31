<template>
    <div class="hello">
        <h2>Essential Links</h2>
        <div>
            <!-- Styled -->
            <b-form-file v-model="file" :state="Boolean(file)" placeholder="Choose a file..."
                         ref="fileinput"></b-form-file>
            <div class="mt-3">Selected file: {{file && file.name}}</div>
            <b-button @click="clearFiles">Reset</b-button>
            <b-button @click="getCoinbase">Coinbase</b-button>
            <b-button @click="deployContract">Deploy Contract</b-button>
            <ul>
                <li v-for="contract in contracts">
                    <strong>{{contract.options.address}}</strong>: {{JSON.stringify(contract.options.jsonInterface)}}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import {mapState, mapMutations, mapGetters} from 'vuex';

    export default {
        name: 'UploadCode',
        data() {
            return {
                contracts: [],
                file: null,
                web3: this.$web3
            }
        },
        computed: {
            //...mapState({contracts: state => state.contracts}),
            ...mapGetters(['getContractById'])
        },
        methods: {
            ...mapMutations([
                'addContract',
                'resetContracts'
            ]),
            clearFiles() {
                this.$refs.fileinput.reset();
            },
            async getCoinbase() {
                let coinbase = await this.web3.eth.getCoinbase();
                console.log('Coinbase: ' + coinbase);
            },
            async deployContract() {
                console.log('Deploying contract');
                let coinbase = await this.web3.eth.getCoinbase();
                let self = this;
                let contract = new this.web3.eth.Contract([{
                    "constant": true,
                    "inputs": [],
                    "name": "storedData",
                    "outputs": [{"name": "", "type": "uint256"}],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                }, {
                    "constant": false,
                    "inputs": [{"name": "x", "type": "uint256"}],
                    "name": "set",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function"
                }, {
                    "constant": true,
                    "inputs": [],
                    "name": "get",
                    "outputs": [{"name": "", "type": "uint256"}],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                }]);
                contract.deploy({
                    arguments: [],
                    data: '0x6060604052341561000f57600080fd5b6101098061001e6000396000f3006060604052600436106053576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680632a1afcd914605857806360fe47b114607e5780636d4ce63c14609e575b600080fd5b3415606257600080fd5b606860c4565b6040518082815260200191505060405180910390f35b3415608857600080fd5b609c600480803590602001909190505060ca565b005b341560a857600080fd5b60ae60d4565b6040518082815260200191505060405180910390f35b60005481565b8060008190555050565b600080549050905600a165627a7a72305820294b93f77e5f86f7204337964c2eb8b99417a439dc2129beb59fccab22e2eadb0029'
                }).send({
                    from: coinbase,
                    gas: 200000,
                    gasPrice: '20000000000'
                }).on('error', function (error) {
                    console.log('Error: ' + error);
                }).on('transactionHash', function (transactionHash) {
                    console.log('Transaction hash: ' + transactionHash);
                }).on('receipt', function (receipt) {
                    console.log('Receipt: ' + receipt.contractAddress) // contains the new contract address
                }).on('confirmation', function (confirmationNumber, receipt) {
                    console.log('Confirmation: ' + confirmationNumber + ', ' + receipt)
                }).then((newContractInstance) => {
                    console.log('New instance address: ' + newContractInstance.options.address); // instance with the new contract address
                    //self.addContract({id: newContractInstance.options.address, contract: newContractInstance});
                    //console.log('Added new contract to store');
                    self.contracts.push(newContractInstance);
                });
            }
        }
    }
    ;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h1, h2 {
        font-weight: normal;
    }

    a {
        color: #42b983;
    }
</style>
