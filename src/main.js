// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import App from './App';
import router from './router';
import Web3 from 'web3';

Vue.config.productionTip = false;
Vue.use(Vuex);
Vue.prototype.$web3 = new Web3(Web3.givenProvider || Web3.currentProvider || "ws://localhost:7545");
window.web3 = Vue.prototype.$web3;

const vuexLocal = new VuexPersistence({ storage: window.localStorage });

const store = new Vuex.Store({
    state: {
        contracts: {}
    },
    mutations: {
        addContract: (state, payload) => {
            state.contracts[payload.id] = payload.contract;
        },
        resetContracts: (state) => {
            contracts = {}
        }
    },
    getters: {
        getContractById: (state) => (id) => {
            return state.contracts[id];
        }
    },
    //plugins: [vuexLocal.plugin]
});

/* eslint-disable no-new */
Window.app = new Vue({
    el: '#app',
    store,
    router,
    components: {App},
    template: '<App/>'
});
