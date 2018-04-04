import * as cuid from 'cuid';
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
var Web3Utils = /** @class */ (function () {
    function Web3Utils(web3) {
        this.web3 = web3;
    }
    Web3Utils.prototype.makeDeployable = function (contractInterface, bin) {
        return { contractInterface: contractInterface, bin: bin };
    };
    Web3Utils.prototype.makeContractDeployable = function (contract) {
        var c = new this.web3.eth.Contract(contract.contractInterface.abi);
        c.options.data = contract.bin;
        return c;
    };
    Web3Utils.prototype.parseTradePackage = function (jsonString) {
        var contractPackage = JSON.parse(jsonString);
        return {
            contractInterface: { id: cuid(), name: contractPackage.name, abi: contractPackage.abi },
            bin: contractPackage.bin
        };
    };
    return Web3Utils;
}());
export { Web3Utils };
//# sourceMappingURL=web3-utils.js.map