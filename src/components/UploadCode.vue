<template>
    <div>
        <h2>Deploy Contract</h2>
        <div>
            <b-form-file v-model="file" :state="haveFile" placeholder="Choose a file..."
                         ref="fileinput"></b-form-file>
            <div class="mt-3">Selected file: {{file && file.name}}</div>
            <b-button @click="clearFiles">Clear</b-button>
            <b-button @click="resetContractManifests">Remove all contracts</b-button>
            <b-button @click="getCoinbase">Coinbase</b-button>
            <b-button @click="uploadAndDeploy" :disabled="!haveFile">Deploy Contract</b-button>
            <ul>
                <li v-for="manifest in contractManifests">
                    <strong>{{manifest.name}}</strong>: {{(manifest.deployedContract &&
                    manifest.deployedContract.options.address) || 'Not deployed'}}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import {mapState, mapMutations, mapGetters} from 'vuex';
    import * as cuid from 'cuid';

    export default {
        name: 'UploadCode',
        data() {
            return {
                file: null,
                web3: this.$web3
            }
        },
        computed: {
            ...mapState('contracts', ['contractManifests']),
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
                    arguments: [],
                    data: manifest.bin,
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
</style>
