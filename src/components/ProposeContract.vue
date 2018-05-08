<template>
    <div class="propose-contract">
        <b-form v-if="isDeployed && !isSigned && !isProposed" inline class="mt-3">
            <b-form-input v-model="toAddress" type="text" placeholder="To address" class="mr-2"></b-form-input>
            <b-button v-if="marketplaceAddress" @click="proposeContract" variant="primary">Propose</b-button>
            <div v-else v-b-tooltip.hover title="No marketplace deployed">
                <b-button disabled variant="primary">Propose</b-button>
            </div>
        </b-form>
        <b-badge v-if="isProposed" class="mt-3">Counterparty: {{contractStatus.counterparty}}</b-badge>
        <b-badge v-if="isProposed" class="mt-3">Holder: {{contractStatus.holder}}</b-badge>
    </div>
</template>

<script>
    import {mapState, mapMutations} from 'vuex';

    export default {
        name: 'ProposeContract',
        beforeMount() {
            window.setInterval(this.refreshProposalStatus.bind(this), 4000);
            this.refreshProposalStatus();
        },
        props: ['contract-id'],
        data() {
            return {
                contractStatus: null,
                toAddress: null,
                web3: this.$web3,
                web3Utils: this.$web3Utils
            }
        },
        computed: {
            ...mapState('tradeMContracts', ['tradeMContractInstances']),
            ...mapState('marketplace', ['marketplaceAddress']),
            ...mapState('accounts', ['selectedAccount']),
            tradeMContractAddress() {
                let instance = this.tradeMContractInstances.find((c) => this.contractId === c.id);
                if (instance) {
                    return instance.address;
                } else {
                    return null;
                }
            },
            isDeployed() {
                return this.tradeMContractAddress !== null;
            },
            isProposed() {
                return this.contractStatus !== null
                    && this.contractStatus.holder !== '0x0000000000000000000000000000000000000000'
                    && this.contractStatus.counterparty !== '0x0000000000000000000000000000000000000000';
            },
            isSigned() {
                return this.contractStatus !== null && this.contractStatus.signed;
            }
        },
        methods: {
            marketplaceContract() {
                return this.web3Utils.getMarketplaceContract(this.marketplaceAddress);
            },
            async proposeContract() {
                let marketplace = this.marketplaceContract();
                if (marketplace.options.address === null) {
                    console.error('Marketplace is not currently deployed');
                    return;
                }
                let contractAddress = this.tradeMContractAddress;
                let toAddress = this.toAddress;
                marketplace.methods.propose(contractAddress, toAddress).send({
                    from: this.selectedAccount,
                    gas: 5000000,
                    gasPrice: '20000000000'
                }).on('error', (err) => {
                    console.log('Error proposing contract: ' + err);
                }).then((txHash) => {
                    console.log(`Proposed ${contractAddress} to ${toAddress}`);
                });
            },
            async refreshProposalStatus() {
                if (this.selectedAccount === null) {
                    return;
                }
                if (this.tradeMContractAddress === null) {
                    this.contractStatus = null;
                    return;
                }
                this.contractStatus = await this.marketplaceContract().methods.contracts_(this.tradeMContractAddress).call();
            }
        }
    }
</script>

<style scoped>

</style>
