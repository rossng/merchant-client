<template>
    <div class="sign-contract">
        <b-form v-if="isProposed && !isSigned" inline class="mt-3">
            <b-button v-if="isSignable" @click="signContract" variant="primary">Sign</b-button>
            <div v-else v-b-tooltip.hover :title="unsignableReason">
                <b-button disabled variant="primary">Sign</b-button>
            </div>
        </b-form>
        <b-badge v-if="isSigned" class="mt-3">Signed</b-badge>
    </div>
</template>

<script>
    import {mapState, mapMutations} from 'vuex';

    export default {
        name: 'SignContract',
        beforeMount() {
            window.setInterval(this.refreshSigningStatus.bind(this), 4000);
            this.refreshSigningStatus();
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
            isProposed() {
                return this.contractStatus !== null
                    && this.contractStatus.holder !== '0x0000000000000000000000000000000000000000'
                    && this.contractStatus.counterparty !== '0x0000000000000000000000000000000000000000';
            },
            isSigned() {
                return this.contractStatus !== null && this.contractStatus.signed;
            },
            isSignable() {
                return this.contractStatus !== null && !this.contractStatus.signed && (this.selectedAccount === this.contractStatus.holder) && this.marketplaceAddress !== null
            },
            unsignableReason() {
                if (this.isSigned) {
                    return 'Already signed';
                } else if (this.contractStatus !== null && this.selectedAccount !== this.contractStatus.holder) {
                    return 'Not proposed to you';
                } else if (this.marketplaceAddress === null) {
                    return 'No marketplace deployed'
                } else {
                    return 'Unknown reason';
                }
            }
        },
        methods: {
            marketplaceContract() {
                return this.web3Utils.getMarketplaceContract(this.marketplaceAddress);
            },
            async signContract() {
                let marketplace = this.marketplaceContract();
                if (marketplace.options.address === null) {
                    console.error('Marketplace is not currently deployed');
                    return;
                }
                let contractAddress = this.tradeMContractAddress;
                let vm = this;
                marketplace.methods.sign(contractAddress).send({
                    from: this.selectedAccount,
                    gas: 3000000,
                    gasPrice: '20000000000'
                }).on('error', (err) => {
                    console.log('Error signing contract: ' + err);
                }).then((txHash) => {
                    console.log(`Signed ${contractAddress}`);
                    vm.refreshSigningStatus();
                });
            },
            async refreshSigningStatus() {
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
