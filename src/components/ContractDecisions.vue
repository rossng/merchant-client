<template>
    <div class="contract-decisions" v-if="isDeployed && isDeployable">
        <h5 class="mt-2">Decisions</h5>
        <b-list-group>
            <b-list-group-item v-for="decision in tradeMContractDecisions" :key="decision">
                <b-button-group>
                    <b-button :disabled="!decisions[decision-1]" @click="updateDecision(decision-1, false)">False</b-button>
                    <b-button :disabled="decisions[decision-1]" @click="updateDecision(decision-1, true)">True</b-button>
                </b-button-group>
            </b-list-group-item>
        </b-list-group>
    </div>
</template>

<script>
    import {mapState, mapMutations} from 'vuex';

    export default {
        name: 'ContractDecisions',
        beforeMount() {
            window.setInterval(this.refreshDecisionsStatus.bind(this), 4000);
            this.refreshDecisionsStatus();
        },
        props: ['contract-id'],
        data() {
            return {
                decisions: [],
                web3: this.$web3,
                web3Utils: this.$web3Utils
            }
        },
        computed: {
            ...mapState('tradeMContracts', ['tradeMContractInstances', 'tradeMContractBinaries', 'tradeMContractInterfaces']),
            ...mapState('accounts', ['selectedAccount']),
            tradeMContractAddress() {
                let instance = this.tradeMContractInstances.find((c) => this.contractId === c.id);
                if (instance) {
                    return instance.address;
                } else {
                    return null;
                }
            },
            isDeployable() {
                return this.tradeMContractBinaries.some((c) => this.contractId === c.id);
            },
            tradeMContractDecisions() {
                let instance = this.tradeMContractBinaries.find((c) => this.contractId === c.id);
                if (instance) {
                    return instance.decisions;
                } else {
                    return null;
                }
            },
            isDeployed() {
                return this.tradeMContractAddress !== null;
            },
            tradeMContractInterface() {
                return this.tradeMContractInterfaces.find((c) => this.contractId === c.id);
            }
        },
        methods: {
            wrapperContract() {
                return this.web3Utils.makeContractInstance(this.tradeMContractInterface, this.tradeMContractAddress);
            },
            async updateDecision(decision, value) {
                console.log(`Updating decision ${decision} to ${value}`);
                let contractInstance = this.wrapperContract();
                let contractAddress = this.tradeMContractAddress;
                let vm = this;
                contractInstance.methods.setDecision(decision, value).send({
                    from: this.selectedAccount,
                    gas: 5000000,
                    gasPrice: '20000000000'
                }).on('error', (err) => {
                    console.log('Error setting contract decision: ' + err);
                }).then((txHash) => {
                    vm.decisions[decision] = value;
                    console.log(`Set decision ${decision} for ${contractAddress} to ${value}`);
                });
            },
            async refreshDecisionsStatus() {
                if (this.tradeMContractAddress === null) {
                    this.decisions = [];
                    return;
                }
                let decisions = [];
                for (let i = 0; i < this.tradeMContractDecisions; i++) {
                    let decision = await this.wrapperContract().methods.getDecision(i, this.selectedAccount).call();
                    decisions.push(decision);
                }
                this.decisions = decisions;
            }
        }
    }
</script>

<style scoped>

</style>
