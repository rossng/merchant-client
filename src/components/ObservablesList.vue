<template>
    <div id="observable-list">
        <h3>Deployed Observables</h3>
        <b-button @click="reset">Remove all observables</b-button>

        <b-card-group deck class="mt-3">
            <Observable v-for="observable in observables" :key="observable.id"
                           :observable-id="observable.id"></Observable>
        </b-card-group>
    </div>
</template>

<script>
    import {mapState, mapMutations, mapGetters} from 'vuex';
    import Observable from './Observable';

    export default {
        name: 'ObservablesList',
        components: {Observable},
        data() {
            return {
                file: null,
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
                resetObservables: 'reset'
            }),
            reset() {
                this.resetObservables();
            },
        }
    }
</script>

<style scoped>
</style>
