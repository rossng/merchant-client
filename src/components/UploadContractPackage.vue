<template>
    <div id="deploy-contract">
        <h2>Deploy Contract</h2>
        <div>
            <b-form-file v-model="file" :state="haveFile" placeholder="Choose a file..."
                         ref="fileinput" class="mb-3"></b-form-file>
            <b-button @click="clearFiles">Clear</b-button>
            <b-button @click="uploadPackage" :disabled="!haveFile">Upload Package</b-button>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {mapState, mapMutations, mapGetters} from 'vuex';
    import * as cuid from 'cuid';
    import {Web3Utils} from "../assets/web3-utils";

    export default Vue.extend({
        name: 'UploadContractPackage',
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
            ...mapState('marketplace', ['marketplaceAddress']),
            haveFile() {
                return Boolean(this.file);
            }
        },
        methods: {
            ...mapMutations('tradeMContracts', {
                addTradeMContractInterface: 'addInterface',
                addTradeMContractDeployable: 'addDeployable',
                resetTradeMContracts: 'reset',
                addTradeMContractInstance: 'addInstance'
            }),
            ...mapMutations('tradeContracts', {
                addTradeContract: 'add',
                resetTradeContracts: 'reset',
            }),
            clearFiles() {
                this.$refs.fileinput.reset();
            },
            delegated(evt, self) {
                console.log(evt);
                let newDeployedContract = self.$baseContract.clone();
                newDeployedContract.options.address = evt.returnValues.to;
                self.addMContractInterface({
                    id: cuid(),
                    name: cuid(),
                    abi: self.$baseContract.abi,
                    deployedContract: newDeployedContract
                });
                this.$forceUpdate();
                console.log('Added delegated contract');
            },
            async parseTradeContract(evt) {
                console.log(`Parsing contract package`);
                let deployableContract = Web3Utils.parseTradePackage(evt.target.result);

                this.addTradeMContractInterface(deployableContract.contractInterface);
                this.addTradeMContractDeployable({
                    id: deployableContract.contractInterface.id,
                    bin: deployableContract.bin,
                    decisions: deployableContract.decisions
                });
            },
            async uploadPackage() {
                console.log('Uploading contract package');
                let fr = new FileReader();
                fr.onloadend = this.parseTradeContract;
                fr.readAsText(this.file);
            }
        }
    });
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
