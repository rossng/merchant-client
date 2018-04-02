<template>
    <div id="deploy-contract">
        <h2>Deploy Contract</h2>
        <div>
            <b-form-file v-model="file" :state="haveFile" placeholder="Choose a file..."
                         ref="fileinput" class="mb-3"></b-form-file>
            <b-button @click="clearFiles">Clear</b-button>
            <b-button @click="resetContractManifests">Remove all contracts</b-button>
            <b-button @click="uploadAndDeploy" :disabled="!haveFile">Deploy Contract</b-button>
            <div class="mt-3">
                <b-card v-for="manifest in contractManifests" :key="manifest.id" :title="manifest.name" class="mb-3"
                        style="max-width: 20rem;">
                    <p class="card-text">{{(manifest.deployedContract &&
                        manifest.deployedContract.options.address) || 'Not deployed'}}</p>
                    <ProposeContract v-if="manifest.deployedContract"
                                     :contract-address="manifest.deployedContract.options.address"/>
                </b-card>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState, mapMutations, mapGetters} from 'vuex';
    import * as cuid from 'cuid';
    import ProposeContract from "./ProposeContract";

    export default {
        name: 'DeployContract',
        components: {ProposeContract},
        data() {
            return {
                file: null,
                web3: this.$web3
            }
        },
        computed: {
            ...mapState('contracts', ['contractManifests']),
            ...mapState('marketplace', ['marketplaceAddress']),
            ...mapGetters('contracts', ['getContractManifest']),
            haveFile() {
                return Boolean(this.file);
            }
        },
        methods: {
            ...mapMutations('contracts', [
                'addContractManifest',
                'resetContractManifests',
                'addDeploymentToManifest'
            ]),
            clearFiles() {
                this.$refs.fileinput.reset();
            },
            async getCoinbase() {
                let coinbase = await this.web3.eth.getCoinbase();
                console.log('Coinbase: ' + coinbase);
            },
            async deployManifest(evt) {
                console.log(`Deploying contract manifest`);
                let coinbase = await this.web3.eth.getCoinbase();
                let manifest = JSON.parse(evt.target.result);
                manifest.id = cuid();
                console.log(`Parsed contract '${manifest.name}' (${manifest.id})`);
                this.addContractManifest(manifest);
                let self = this;
                let contract = new this.web3.eth.Contract(manifest.abi);
                contract.deploy({
                    arguments: [this.marketplaceAddress],
                    data: manifest.bin,
                }).send({
                    from: coinbase,
                    gas: 10000000,
                    gasPrice: '20000000000'
                }).on('error', function (error) {
                    console.log('Error: ' + error);
                }).on('transactionHash', function (transactionHash) {
                    console.log('Transaction hash: ' + transactionHash);
                }).on('receipt', function (receipt) {
                    console.log('Receipt: ' + receipt.contractAddress) // contains the new contract address
                }).on('confirmation', function (confirmationNumber, receipt) {
                    console.log('Confirmation: ' + confirmationNumber + ', ' + manifest.id)
                }).then((newContractInstance) => {
                    console.log(`New '${manifest.name}' instance address: ${newContractInstance.options.address}`); // instance with the new contract address
                    self.addDeploymentToManifest({id: manifest.id, deployedContract: newContractInstance});
                    console.log('Added new contract to store');
                });
            },
            async uploadAndDeploy() {
                console.log('Uploading contract manifest');
                let fr = new FileReader();
                fr.onloadend = this.deployManifest;
                fr.readAsText(this.file);
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

    #deploy-contract {
        border: 1px solid grey;
        margin: 10px;
        padding: 10px;
    }
</style>
