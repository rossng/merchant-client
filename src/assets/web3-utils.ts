import {Contract, ABIDefinition} from 'web3/types';
import Web3 from 'web3/index'
import * as cuid from 'cuid';

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


export class Web3Utils {
    constructor(private web3: Web3) {
    }

    public makeDeployable(contractInterface: MContractInterface, bin: string): MContractDeployable {
        return {contractInterface: contractInterface, bin: bin};
    }

    public makeContractDeployable(contract: MContractDeployable): Contract {
        let c = new this.web3.eth.Contract(contract.contractInterface.abi);
        c.options.data = contract.bin;
        return c;
    }

    public parseTradePackage(jsonString: string): MContractDeployable {
        let contractPackage: TradePackage = JSON.parse(jsonString);
        return {
            contractInterface: {id: cuid(), name: contractPackage.name, abi: contractPackage.abi},
            bin: contractPackage.bin
        };
    }
}
