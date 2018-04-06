import {Contract, ABIDefinition} from 'web3/types';
import Web3 from 'web3/index'
import * as cuid from 'cuid';
import {BaseContractAbi, MarketplaceAbi, MarketplaceBin} from "./static-contracts";

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

    public makeDeployable(contractInterface: MContractInterface, bin: string): MContractDeployable {
        return {contractInterface: contractInterface, bin: bin};
    }

    public makeContract(contract: MContractInterface, bin: string): Contract {
        let c = new this.web3.eth.Contract(contract.abi);
        c.options.data = bin;
        return c;
    }

    public parseTradePackage(jsonString: string): MContractDeployable {
        let contractPackage: TradePackage = JSON.parse(jsonString);
        return {
            contractInterface: {id: cuid(), name: contractPackage.name, abi: contractPackage.abi},
            bin: contractPackage.bin
        };
    }

    public getMarketplaceContract(address: string): Contract {
        let c = new this.web3.eth.Contract(MarketplaceAbi);
        c.options.data = MarketplaceBin;
        c.options.address = address;
        return c;
    }

    public makeContractInstance(contractInterface: MContractInterface, address: string): Contract {
        return new this.web3.eth.Contract(contractInterface.abi, address);
    }

    public makeDelegatedInterface(parentName: string): MContractInterface {
        return new MContractInterface(cuid(), `${parentName}'`, BaseContractAbi as any);
    }

    public async queryMarketplaceContract(marketplace: Contract, contractAddress: string): Promise<ContractDetails> {
        return await marketplace.methods.contracts_(contractAddress).call();
    }
}
