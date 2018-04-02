// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import App from './App';
import router from './router';
import Web3 from 'web3';
import BootstrapVue from "bootstrap-vue";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.config.productionTip = false;
Vue.use(Vuex);
Vue.use(BootstrapVue);
Vue.prototype.$web3 = new Web3(Web3.givenProvider || Web3.currentProvider || "ws://localhost:7545");
window.web3 = Vue.prototype.$web3;

const vuexLocal = new VuexPersistence({
    storage: window.localStorage,
    reducer: state => ({marketplace: state.marketplace})
});

const contractsStore = {
    namespaced: true,
    state: {
        contractManifests: []
    },
    mutations: {
        addContractManifest: (state, payload) => {
            state.contractManifests.push(payload);
        },
        resetContractManifests: (state) => {
            contractManifests = []
        },
        addDeploymentToManifest: (state, payload) => {
            state.contractManifests.find(manifest => manifest.id === payload.id).deployedContract = payload.deployedContract;
        }
    },
    getters: {
        getContractManifest: (state) => (idx) => {
            return state.contractManifests[idx];
        }
    },
    actions: {
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
    },
    mutations: {
        updateAccounts: (state, payload) => {
            state.accounts = payload;
        },
    },
    plugins: [vuexLocal.plugin]
};

const store = new Vuex.Store({
    modules: {
        contracts: contractsStore,
        marketplace: marketplaceStore,
        accounts: accountsStore
    },
    plugins: [vuexLocal.plugin]
});

Window.app = new Vue({
    el: '#app',
    store,
    router,
    components: {App},
    template: '<App/>'
});
