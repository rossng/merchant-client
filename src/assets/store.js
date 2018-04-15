import VuexPersistence from "vuex-persist";
import Vuex from "vuex";
import Vue from "vue";

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
    storage: window.localStorage,
    reducer: state => ({marketplace: state.marketplace, tradeMContracts: state.tradeMContracts, observables: state.observables})
});

const tradeMContractsStore = {
    namespaced: true,
    state: {
        tradeMContractInterfaces: [],
        tradeMContractBinaries: [],
        tradeMContractInstances: [],
        tradeMContractInstanceKills: []
    },
    mutations: {
        addInterface: (state, payload) => {
            state.tradeMContractInterfaces.push(payload);
        },
        addDeployable: (state, payload) => {
            state.tradeMContractBinaries.push(payload);
        },
        addInstance: (state, payload) => {
            state.tradeMContractInstances.push(payload);
        },
        killInstance: (state, payload) => {
            state.tradeMContractInstanceKills.push(payload);
        },
        reset: (state) => {
            state.tradeMContractInterfaces = [];
            state.tradeMContractBinaries = [];
            state.tradeMContractInstances = [];
            state.tradeMContractInstanceKills = [];
        },
    },
    getters: {
        getById: (state) => (id) => {
            return state.tradeMContractBinaries.find(c => id === c.id);
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

const observablesStore = {
    namespaced: true,
    state: {
        observables: []
    },
    mutations: {
        addObservable: (state, payload) => {
            state.observables.push(payload);
        },
        updateValue: (state, payload) => {
            state.observables.find((c) => payload.id === c.id).value = payload.value;
        },
        reset: (state, payload) => {
            state.observables = [];
        }
    }
};

export const store = new Vuex.Store({
    modules: {
        tradeMContracts: tradeMContractsStore,
        tradeContracts: tradeContractsStore,
        marketplace: marketplaceStore,
        accounts: accountsStore,
        observables: observablesStore
    },
    plugins: [vuexLocal.plugin]
});
