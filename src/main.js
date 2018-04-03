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
            state.contractManifests = []
        },
        addDeploymentToManifest: (state, payload) => {
            state.contractManifests.find(manifest => manifest.id === payload.id).deployedContract = payload.deployedContract;
        },
        proposeManifest: (state, payload) => {
            state.contractManifests.find(manifest => manifest.id === payload.id).proposed = true;
        },
        signManifest: (state, payload) => {
            state.contractManifests.find(manifest => manifest.id === payload.id).signed = true;
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


getWeb3.then((result) => {
    Vue.prototype.$web3 = result.web3;
    Vue.prototype.$marketplaceContract = new result.web3.eth.Contract([{"constant":true,"inputs":[{"name":"contractAddress","type":"address"}],"name":"signed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"contracts_","outputs":[{"name":"counterparty","type":"address"},{"name":"holder","type":"address"},{"name":"signed","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"commodity","type":"uint8"},{"name":"quantity","type":"uint256"}],"name":"award","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newContract","type":"address"}],"name":"delegate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"balances_","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"commodity","type":"uint8"},{"name":"quantity","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner_","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"contractAddress","type":"address"},{"name":"to","type":"address"}],"name":"propose","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"commodity","type":"uint8"},{"name":"quantity","type":"uint256"}],"name":"receive","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"contractAddress","type":"address"}],"name":"sign","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"contractAddress","type":"address"},{"indexed":true,"name":"to","type":"address"}],"name":"Proposed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"contractAddress","type":"address"}],"name":"Signed","type":"event"}]);
    Vue.prototype.$marketplaceContract.options.data = "0x6060604052341561000f57600080fd5b6000600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600080600181111561005e57fe5b8152602001908152602001600020819055506000600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006001808111156100bf57fe5b815260200190815260200160002081905550336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610ef8806101206000396000f3006060604052600436106100a4576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680630555ff41146100a957806349b20a90146100fa5780634f04667e146101b15780635c19a95c146101ff5780636e11431014610238578063709044831461028e578063e7663079146102dc578063e8f1586414610331578063e9c3f59214610389578063f71be837146103b8575b600080fd5b34156100b457600080fd5b6100e0600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506103f1565b604051808215151515815260200191505060405180910390f35b341561010557600080fd5b610131600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190505061044a565b604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182151515158152602001935050505060405180910390f35b34156101bc57600080fd5b6101fd600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803560ff169060200190919080359060200190919050506104c1565b005b341561020a57600080fd5b610236600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190505061058a565b005b341561024357600080fd5b610278600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919080359060200190919050506107ee565b6040518082815260200191505060405180910390f35b341561029957600080fd5b6102da600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803560ff16906020019091908035906020019091905050610813565b005b34156102e757600080fd5b6102ef610954565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561033c57600080fd5b610387600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610979565b005b341561039457600080fd5b6103b6600480803560ff16906020019091908035906020019091905050610b8e565b005b34156103c357600080fd5b6103ef600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610d14565b005b6000600160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160149054906101000a900460ff169050919050565b60016020528060005260406000206000915090508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060010160149054906101000a900460ff16905083565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561051c57600080fd5b80600260008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600084600181111561056a57fe5b815260200190815260200160002060008282540192505081905550505050565b60011515600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160149054906101000a900460ff1615151415156105ec57600080fd5b606060405190810160405280600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200160011515815250600160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060408201518160010160146101000a81548160ff02191690831515021790555090505050565b6002602052816000526040600020602052806000526040600020600091509150505481565b80600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600084600181111561086157fe5b8152602001908152602001600020541015151561087d57600080fd5b80600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008460018111156108cb57fe5b81526020019081526020016000206000828254039250508190555080600260008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600084600181111561093457fe5b815260200190815260200160002060008282540192505081905550505050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160149054906101000a900460ff161515156109d557600080fd5b6060604051908101604052803373ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff16815260200160001515815250600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060408201518160010160146101000a81548160ff0219169083151502179055509050508073ffffffffffffffffffffffffffffffffffffffff167f2d55e9009d2ba2489867b9a937e7cefc252f9a6a959643a905cb0bd46e91d19f83604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a25050565b6000600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000209050600115158160010160149054906101000a900460ff161515141515610bf557600080fd5b81600260008360000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000856001811115610c6757fe5b81526020019081526020016000206000828254039250508190555081600260008360010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000856001811115610cf457fe5b815260200190815260200160002060008282540192505081905550505050565b600160008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610db057600080fd5b600160008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160149054906101000a900460ff16151515610e0c57600080fd5b60018060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160146101000a81548160ff0219169083151502179055507f568aebae0f7dc6c96727fb4cdfdf7add45fec43fffd69b3fa71ea0898a27f8cc81604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a1505600a165627a7a723058201448d9ea7b306e464d8cac6177564878e2ab10cf6a9820cfd6811be5d88d5b340029";
    Vue.prototype.$baseContract = new result.web3.eth.Contract([{"constant":false,"inputs":[],"name":"proceed","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"marketplace_","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"marketplace","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"to","type":"address"}],"name":"Delegated","type":"event"}]);

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
