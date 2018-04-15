import {Contract, ABIDefinition} from 'web3/types';
import Web3 from 'web3/index'
import * as cuid from 'cuid';
import * as contracts from "./static-contracts";

/** Represents a contract with ABI only that has been deployed. */
export class MContractInstanceInterface {
    public constructor(public id: string, public name: string, public abi: ABIDefinition[], public address: string) {}
}

export class MContractInstanceDeployable {
    public constructor(public contractInterface: MContractInstanceInterface, public bin: string) {}
}

export class MContractInterface {
    public constructor(public id: string, public name: string, public abi: ABIDefinition[]) {}
}

export class MContractDeployable {
    public constructor(public contractInterface: MContractInterface, public bin: string) {}
}

export class TradePackage {
    public constructor(public name: string, public bin: string, public abi: ABIDefinition[]) {}
}

export class ContractDetails {
    public constructor(public counterparty: string, public holder: string, public signed: boolean) {}
}


export class Web3Utils {
    constructor(private web3: Web3) {
    }

    public makeContract(contract: MContractInterface, bin: string): Contract {
        let c = new this.web3.eth.Contract(contract.abi);
        c.options.data = bin;
        return c;
    }

    static parseTradePackage(jsonString: string): MContractDeployable {
        let contractPackage: TradePackage = JSON.parse(jsonString);
        return {
            contractInterface: {id: cuid(), name: contractPackage.name, abi: contractPackage.abi},
            bin: contractPackage.bin
        };
    }

    public getMarketplaceContract(address: string): Contract {
        let c = new this.web3.eth.Contract(contracts.MarketplaceAbi);
        c.options.data = contracts.MarketplaceBin;
        c.options.address = address;
        return c;
    }

    public getUserIntObservable(address: string): Contract {
        let c = new this.web3.eth.Contract(contracts.UserIntObservableAbi);
        c.options.data = contracts.UserIntObservableBin;
        c.options.address = address;
        return c;
    }

    public getUserBoolObservable(address: string): Contract {
        let c = new this.web3.eth.Contract(contracts.UserBoolObservableAbi);
        c.options.data = contracts.UserBoolObservableBin;
        c.options.address = address;
        return c;
    }

    public makeContractInstance(contractInterface: MContractInterface, address: string): Contract {
        return new this.web3.eth.Contract(contractInterface.abi, address);
    }

    static makeDelegatedInterface(parentName: string): MContractInterface {
        return new MContractInterface(cuid(), `${parentName}'`, contracts.BaseContractAbi as any);
    }
}
