<template>
    <div id="deploy-contract">
        <h2>Deploy Contract</h2>
        <div>
            <b-form-file v-model="file" :state="haveFile" placeholder="Choose a file..."
                         ref="fileinput" class="mb-3"></b-form-file>
            <b-button @click="clearFiles">Clear</b-button>
            <b-button @click="reset">Remove all contracts</b-button>
            <b-button @click="uploadAndDeploy" :disabled="!haveFile">Deploy Contract</b-button>
            <div class="mt-3">
                <b-card v-for="manifest in tradeMContractInterfaces" :key="manifest.id" :title="manifest.name"
                        class="mb-3"
                        style="max-width: 20rem;">
                    <p v-if="manifest.proposed">Proposed</p>
                    <p v-if="manifest.signed">Signed</p>
                    <p class="card-text">{{(manifest.deployedContract &&
                        manifest.deployedContract.options.address) || 'Not deployed'}}</p>
                    <!--<ProposeContract v-if="manifest.deployedContract"
                                     :contract-address="manifest.deployedContract.options.address"/>
                    <ProceedContract v-if="manifest.deployedContract"
                                     :contract-address="manifest.deployedContract.options.address"/>-->
                </b-card>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {mapState, mapMutations, mapGetters} from 'vuex';
    import * as cuid from 'cuid';
    import ProposeContract from "./ProposeContract";
    import ProceedContract from "./ProceedContract";
    import {Web3Utils, MContractInterface, MContractDeployable} from "../assets/web3-utils";

    export default Vue.extend({
        name: 'DeployContract',
        components: {ProceedContract, ProposeContract},
        data() {
            return {
                file: null,
                web3: this.$web3,
                web3Utils: this.$web3Utils
            }
        },
        computed: {
            ...mapState('tradeMContracts', ['tradeMContractInterfaces', 'tradeMContractInstanceAddresses']),
            ...mapState('tradeContracts', ['tradeContracts']),
            ...mapState('marketplace', ['marketplaceAddress']),
            haveFile() {
                return Boolean(this.file);
            }
        },
        methods: {
            ...mapMutations('tradeMContracts', {
                addTradeMContract: 'add',
                resetTradeMContracts: 'reset',
                addTradeMContractAddress: 'addAddress'
            }),
            ...mapMutations('tradeContracts', {
                addTradeContract: 'add',
                resetTradeContracts: 'reset',
            }),
            clearFiles() {
                this.$refs.fileinput.reset();
            },
            async getAccount() {
                let accounts = await this.web3.eth.getAccounts();
                console.log(`Current accounts: ${accounts}`);
                return accounts[0];
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
            reset() {
                this.resetTradeMContracts();
                this.resetTradeContracts();
            },
            async deployTradePackage(evt) {
                console.log(`Deploying contract manifest`);
                let account = await this.getAccount();
                let deployableContract = this.web3Utils.parseTradePackage(evt.target.result);

                this.addTradeMContract(deployableContract.contractInterface);
                let vm = this;
                let tradeContract = this.web3Utils.makeContractDeployable(deployableContract);
                tradeContract.deploy({arguments: [this.marketplaceAddress]}).send({
                    from: account,
                    gas: 5000000,
                    gasPrice: '20000000000'
                }).on('error', console.error).then((contractInstance) => {
                    vm.addTradeMContractAddress({
                        id: deployableContract.contractInterface.id,
                        address: contractInstance.options.address
                    });
                    vm.addTradeContract({id: deployableContract.contractInterface.id, contract: contractInstance});
                    console.log(`New MContract ${deployableContract.contractInterface.name} deployed to ${contractInstance.options.address}`);
                    // TODO: add delegation
                    vm.$forceUpdate();
                });
            },
            async uploadAndDeploy() {
                console.log('Uploading contract manifest');
                let fr = new FileReader();
                fr.onloadend = this.deployTradePackage;
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
