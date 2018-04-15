<template>
    <b-card :header="`${observable.type} Observable`" header-tag="header"
            :footer="`id: ${observable.id}`" footer-tag="footer"
            title="" style="max-width: 30rem; min-width: 30rem;"
            class="mb-2">

        <h4><b-badge class="mt-2">{{observable.value === null ? 'false' : observable.value}}</b-badge></h4>

        <b-button size="sm" v-clipboard:copy="observable.address" class="mt-2">Address
            <b-badge variant="light">{{observable.address}}</b-badge>
        </b-button>
        <b-badge class="mt-2">Created by {{observable.creator}}</b-badge>

        <b-form inline class="mt-2">
            <b-form-select v-if="observable.type === 'Bool'" v-model="newValue" :options="booleanValues"
                           class="mb-2 mr-sm-2 mb-sm-0"></b-form-select>
            <b-input v-else v-model="newValue" type="number"></b-input>
            <b-button @click="updateObservable">Update</b-button>
        </b-form>
    </b-card>
</template>

<script>
    import {mapState, mapMutations, mapGetters} from 'vuex';

    export default {
        name: 'Observable',
        props: ['observable-id'],
        async beforeMount() {
            await this.subscribeToUpdates();
        },
        data() {
            return {
                newValue: null,
                booleanValues: [
                    { text: 'True', value: true },
                    { text: 'False', value: false }
                ],
                web3: this.$web3,
                web3Utils: this.$web3Utils
            }
        },
        computed: {
            ...mapState('observables', ['observables']),
            ...mapState('marketplace', ['marketplaceAddress']),
            ...mapState('accounts', ['selectedAccount']),
            observable() {
                return this.observables.find((c) => this.observableId === c.id);
            }
        },
        methods: {
            ...mapMutations('observables', {
                addObservable: 'addObservable',
                updateObservableValue: 'updateValue'
            }),
            observableContract() {
                return this.observable.type === 'Bool' ? this.web3Utils.getUserBoolObservable(this.observable.address) : this.web3Utils.getUserIntObservable(this.observable.address);
            },
            async updateObservable() {
                let observable = this.observable;
                let contract = observable.type === 'Bool' ? this.web3Utils.getUserBoolObservable(observable.address) : this.web3Utils.getUserIntObservable(observable.address);
                contract.methods.setValue(this.newValue).send({
                    from: this.selectedAccount,
                    gas: 1000000,
                    gasPrice: '20000000000'
                }).on('error', function (error) {
                    console.log('Error: ' + error);
                }).then((receipt) => {
                    console.log(`Updated value of observable ${observable.id} (tx: ${receipt.transactionHash})`);
                    this.$forceUpdate();
                })
            },
            async subscribeToUpdates() {
                if (!this.$usingMetaMask) {
                    this.observableContract().events.ValueUpdated({
                        fromBlock: 0
                    }, function (error, event) {
                        if (error !== null) {
                            console.error(error);
                            return;
                        }
                        this.updateObservableValue({
                            id: this.observableId,
                            value: event.returnValues.newValue
                        });
                        this.$forceUpdate();
                        console.log(`Updated value of observable ${this.observable.type}{${this.observableId}} to ${event.returnValues.newValue}`);
                    }.bind(this));
                }
            }
        }
    }
</script>

<style scoped>

</style>
