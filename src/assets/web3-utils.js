import * as cuid from 'cuid';
import * as contracts from "./static-contracts";
/** Represents a contract with ABI only that has been deployed. */
var MContractInstanceInterface = /** @class */ (function () {
    function MContractInstanceInterface(id, name, abi, address) {
        this.id = id;
        this.name = name;
        this.abi = abi;
        this.address = address;
    }
    return MContractInstanceInterface;
}());
export { MContractInstanceInterface };
var MContractInstanceDeployable = /** @class */ (function () {
    function MContractInstanceDeployable(contractInterface, bin) {
        this.contractInterface = contractInterface;
        this.bin = bin;
    }
    return MContractInstanceDeployable;
}());
export { MContractInstanceDeployable };
var MContractInterface = /** @class */ (function () {
    function MContractInterface(id, name, abi) {
        this.id = id;
        this.name = name;
        this.abi = abi;
    }
    return MContractInterface;
}());
export { MContractInterface };
var MContractDeployable = /** @class */ (function () {
    function MContractDeployable(contractInterface, bin) {
        this.contractInterface = contractInterface;
        this.bin = bin;
    }
    return MContractDeployable;
}());
export { MContractDeployable };
var TradePackage = /** @class */ (function () {
    function TradePackage(name, bin, abi) {
        this.name = name;
        this.bin = bin;
        this.abi = abi;
    }
    return TradePackage;
}());
export { TradePackage };
var ContractDetails = /** @class */ (function () {
    function ContractDetails(counterparty, holder, signed) {
        this.counterparty = counterparty;
        this.holder = holder;
        this.signed = signed;
    }
    return ContractDetails;
}());
export { ContractDetails };
var Web3Utils = /** @class */ (function () {
    function Web3Utils(web3) {
        this.web3 = web3;
    }
    Web3Utils.prototype.makeContract = function (contract, bin) {
        var c = new this.web3.eth.Contract(contract.abi);
        c.options.data = bin;
        return c;
    };
    Web3Utils.parseTradePackage = function (jsonString) {
        var contractPackage = JSON.parse(jsonString);
        return {
            contractInterface: { id: cuid(), name: contractPackage.name, abi: contractPackage.abi },
            bin: contractPackage.bin
        };
    };
    Web3Utils.prototype.getMarketplaceContract = function (address) {
        var c = new this.web3.eth.Contract(contracts.MarketplaceAbi);
        c.options.data = contracts.MarketplaceBin;
        c.options.address = address;
        return c;
    };
    Web3Utils.prototype.getUserIntObservable = function (address) {
        var c = new this.web3.eth.Contract(contracts.UserIntObservableAbi);
        c.options.data = contracts.UserIntObservableBin;
        c.options.address = address;
        return c;
    };
    Web3Utils.prototype.getUserBoolObservable = function (address) {
        var c = new this.web3.eth.Contract(contracts.UserBoolObservableAbi);
        c.options.data = contracts.UserBoolObservableBin;
        c.options.address = address;
        return c;
    };
    Web3Utils.prototype.makeContractInstance = function (contractInterface, address) {
        return new this.web3.eth.Contract(contractInterface.abi, address);
    };
    Web3Utils.makeDelegatedInterface = function (parentName) {
        return new MContractInterface(cuid(), parentName + "'", contracts.BaseContractAbi);
    };
    return Web3Utils;
}());
export { Web3Utils };
//# sourceMappingURL=web3-utils.js.map