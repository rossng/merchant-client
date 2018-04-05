var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import * as cuid from 'cuid';
import { MarketplaceAbi, MarketplaceBin } from "./static-contracts";
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
    Web3Utils.prototype.getMarketplaceContract = function (address) {
        var c = new this.web3.eth.Contract(MarketplaceAbi);
        c.options.data = MarketplaceBin;
        c.options.address = address;
        return c;
    };
    Web3Utils.prototype.makeContractInstance = function (contractInterface, address) {
        return new this.web3.eth.Contract(contractInterface.abi, address);
    };
    Web3Utils.prototype.queryMarketplaceContract = function (marketplace, contractAddress) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, marketplace.methods.contracts_(contractAddress).call()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return Web3Utils;
}());
export { Web3Utils };
//# sourceMappingURL=web3-utils.js.map