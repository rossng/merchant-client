<template>
    <div class="deploy-observable">
        <h3>Deploy Observable</h3>
        <b-form inline>
            <b-form-select v-model="observableType" :options="observableTypes"
                           class="mb-2 mr-sm-2 mb-sm-0"></b-form-select>
            <b-button @click="deployObservable">Deploy Observable</b-button>
        </b-form>
    </div>
</template>

<script>
    import {mapState, mapMutations} from 'vuex';
    import * as cuid from 'cuid';

    export default {
        name: 'DeployObservable',
        beforeMount() {
        },
        props: ['contract-id'],
        data() {
            return {
                observableType: 'Bool',
                observableTypes: [
                    {value: 'Bool', text: 'Bool'},
                    {value: 'Int', text: 'Int'}
                ],
                web3: this.$web3,
                web3Utils: this.$web3Utils
            }
        },
        computed: {
            ...mapState('observables', ['observables']),
            ...mapState('accounts', ['selectedAccount'])
        },
        methods: {
            ...mapMutations('observables', {
                addObservable: 'addObservable',
                updateObservableValue: 'updateValue'
            }),
            async deployObservable() {
                let account = this.selectedAccount;
                let vm = this;
                let observableType = this.observableType;
                let initialValue = observableType === 'Bool' ? false : 0;
                let id = cuid();
                let observableContract = observableType === 'Bool' ? this.web3Utils.getUserBoolObservable(null) : this.web3Utils.getUserIntObservable(null);
                console.log(`Starting deployment of ${id}`);
                observableContract.deploy({
                    data: observableContract.options.data,
                    arguments: [account, initialValue]
                }).send({
                    from: account,
                    gas: 2700000,
                    gasPrice: '20000000000'
                }).on('error', (err) => {
                    console.error(err);
                }).then((contractInstance) => {
                    console.log(`New observable ${observableType}{${id}} deployed to ${contractInstance.options.address}`);
                    vm.addObservable({
                        id: id,
                        creator: account,
                        address: contractInstance.options.address,
                        type: observableType,
                        value: initialValue
                    });

                    vm.$forceUpdate();
                });
            }
        }
    }
</script>

<style scoped>

</style>
