let solc = require('solc');
var fs = require('fs');

let input = JSON.stringify({
    language: "Solidity",
    sources: {
        "Marketplace.sol": {urls: ["contracts/Marketplace.sol"]}
        //"test": { content: "contract mortal { function kill() { selfdestruct(msg.sender); } }"}
    },
    settings:
        {
            optimizer: {
                enabled: false,
                runs: 500
            },
            evmVersion: "byzantium",
            // The following can be used to select desired outputs.
            // If this field is omitted, then the compiler loads and does type checking, but will not generate any outputs apart from errors.
            // The first level key is the file name and the second is the contract name, where empty contract name refers to the file itself,
            // while the star refers to all of the contracts.
            //
            // The available output types are as follows:
            //   abi - ABI
            //   ast - AST of all source files
            //   legacyAST - legacy AST of all source files
            //   devdoc - Developer documentation (natspec)
            //   userdoc - User documentation (natspec)
            //   metadata - Metadata
            //   ir - New assembly format before desugaring
            //   evm.assembly - New assembly format after desugaring
            //   evm.legacyAssembly - Old-style assembly format in JSON
            //   evm.bytecode.object - Bytecode object
            //   evm.bytecode.opcodes - Opcodes list
            //   evm.bytecode.sourceMap - Source mapping (useful for debugging)
            //   evm.bytecode.linkReferences - Link references (if unlinked object)
            //   evm.deployedBytecode* - Deployed bytecode (has the same options as evm.bytecode)
            //   evm.methodIdentifiers - The list of function hashes
            //   evm.gasEstimates - Function gas estimates
            //   ewasm.wast - eWASM S-expressions format (not supported atm)
            //   ewasm.wasm - eWASM binary format (not supported atm)
            //
            // Note that using a using `evm`, `evm.bytecode`, `ewasm`, etc. will select every
            // target part of that output. Additionally, `*` can be used as a wildcard to request everything.
            //
            outputSelection: {
                // Enable the metadata and bytecode outputs of every single contract.
                "*": {
                    "*": ["abi", "evm.deployedBytecode.object"]
                }
            }
        }
});
let findImports = path => {
    try {
        let data = fs.readFileSync(path, 'utf8');
        return {contents: data};
    } catch (e) {
        return {error: e};
    }
};


let outputString = solc.compileStandardWrapper(input, findImports);

let output = JSON.parse(outputString);

let manifest = {
    name: "MyContract",
    bin: `0x${output.contracts['Marketplace.sol'].MyContract.evm.deployedBytecode.object}`,
    abi: output.contracts['Marketplace.sol'].MyContract.abi
};

console.log(manifest);

fs.writeFile('contracts/MyContract.json', JSON.stringify(manifest), function (err) {
    if (err)
        return console.log(err);
});
