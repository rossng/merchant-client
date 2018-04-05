// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import VueClipboard from 'vue-clipboard2'
import App from './App';
import router from './router';
import Web3 from 'web3';
import BootstrapVue from "bootstrap-vue";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import {Web3Utils} from "./assets/web3-utils";
import {MarketplaceAbi, MarketplaceBin, BaseContractAbi} from "./assets/static-contracts";

// https://github.com/DOkwufulueze/eth-vue/blob/ee618d19c80cef4a7c4767e7fd18e5b77da37fb4/src/util/web3/getWeb3.js
let getWeb3 = new Promise(function (resolve, reject) {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener('load', function () {
        let web3 = window.web3;

        // Checking if Web3 has been injected by the browser (Mist/MetaMask)
        if (typeof web3 !== 'undefined') {
            // Use Mist/MetaMask's provider
            web3 = new Web3(web3.currentProvider);
            resolve({
                web3: web3
            })
        } else {
            reject({
                result: null,
                err: 'Unable to connect to Web3'
            })
        }
    })
});

Vue.config.productionTip = false;
Vue.use(Vuex);
Vue.use(BootstrapVue);
Vue.use(VueClipboard);

const vuexLocal = new VuexPersistence({
    storage: window.localStorage,
    reducer: state => ({marketplace: state.marketplace, tradeMContracts: state.tradeMContracts})
});

const tradeMContractsStore = {
    namespaced: true,
    state: {
        tradeMContractDeployables: [],
        tradeMContractInstances: [],
        tradeMContractInstanceKills: []
    },
    mutations: {
        add: (state, payload) => {
            state.tradeMContractDeployables.push(payload);
        },
        reset: (state) => {
            state.tradeMContractDeployables = [];
            state.tradeMContractInstances = [];
        },
        addInstance: (state, payload) => {
            state.tradeMContractInstances.push(payload);
        },
        killInstance: (state, payload) => {
            state.tradeMContractInstanceKills.push(payload);
        }
    },
    getters: {
        getById: (state) => (id) => {
            return state.tradeMContractDeployables.find(c => id === c.id);
        },
        getAddressById: (state) => (id) => {
            return state.tradeMContractInstances.find(c => id === c.id);
        }
    },
    actions: {}
};

const tradeContractsStore = {
    namespaced: true,
    state: {
        tradeContracts: []
    },
    mutations: {
        add: (state, payload) => {
            state.tradeContracts.push(payload);
        },
        reset: (state, payload) => {
            state.tradeContracts = [];
        }
    }
};

const marketplaceStore = {
    namespaced: true,
    state: {
        marketplaceAddress: null
    },
    mutations: {
        setMarketplaceAddress: (state, payload) => {
            state.marketplaceAddress = payload;
        }
    }
};

const accountsStore = {
    namespaced: true,
    state: {
        accounts: [],
        selectedAccount: null
    },
    mutations: {
        updateAccounts: (state, payload) => {
            state.accounts = payload;
        },
        updateSelectedAccount: (state, payload) => {
            state.selectedAccount = payload;
        }
    }
};

const store = new Vuex.Store({
    modules: {
        tradeMContracts: tradeMContractsStore,
        tradeContracts: tradeContractsStore,
        marketplace: marketplaceStore,
        accounts: accountsStore
    },
    plugins: [vuexLocal.plugin]
});


getWeb3.then((result) => {
    Vue.prototype.$web3 = result.web3;
    Vue.prototype.$web3Utils = new Web3Utils(result.web3);
    Vue.prototype.$baseContract = new result.web3.eth.Contract(BaseContractAbi);

    Window.app = new Vue({
        el: '#app',
        store,
        router,
        components: {App},
        template: '<App/>'
    });
}).catch((error) => {
    console.error('Problem loading web3');
    console.error(error);
});
