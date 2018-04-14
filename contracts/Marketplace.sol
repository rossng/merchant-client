pragma solidity ^0.4.21;
pragma experimental ABIEncoderV2;

contract Marketplace {
    enum Commodity {USD, GBP}

    struct ContractMetadata {
        address counterparty;
        address holder;
        bool signed;
    }

    event Proposed(address contractAddress, address indexed to);
    event Signed(address contractAddress);
    event Delegated(address indexed from, address to);

    address public creator_;

    mapping(address => ContractMetadata) public contracts_;

    mapping(address => mapping(uint => int)) public balances_;

    constructor() public {
        balances_[msg.sender][uint(Commodity.USD)] = 0;
        balances_[msg.sender][uint(Commodity.GBP)] = 0;
        creator_ = msg.sender;
    }

    function signed(address contractAddress) public constant returns (bool) {
        return contracts_[contractAddress].signed;
    }

    function propose(BaseContract contractAddress, address to) public {
        //require(contractAddress.creator_() == msg.sender);
        // is being requested by creator of contract
        require(!contracts_[contractAddress].signed);
        // has not already been signed
        contracts_[contractAddress] = ContractMetadata(msg.sender, to, false);
        emit Proposed(contractAddress, to);
    }

    function sign(address contractAddress) public {
        require(msg.sender == contracts_[contractAddress].holder);
        require(!contracts_[contractAddress].signed);
        contracts_[contractAddress].signed = true;
        emit Signed(contractAddress);
    }

    function receive(Commodity commodity, int quantity) public {
        ContractMetadata storage c = contracts_[msg.sender];
        require(c.signed == true);
        balances_[c.counterparty][uint(commodity)] -= quantity;
        balances_[c.holder][uint(commodity)] += quantity;
    }

    function delegate(address newContract) public {
        require(contracts_[msg.sender].signed == true);
        contracts_[newContract] = ContractMetadata(
            contracts_[msg.sender].counterparty,
            contracts_[msg.sender].holder,
            true
        );
        emit Delegated(msg.sender, newContract);
    }

    function give(address newContract) public {
        require(contracts_[msg.sender].signed == true);
        contracts_[newContract] = ContractMetadata(
            contracts_[msg.sender].holder,
            contracts_[msg.sender].counterparty,
            true
        );
        emit Delegated(msg.sender, newContract);
    }

    function transfer(address to, Commodity commodity, uint quantity) public {
        require(uint(balances_[msg.sender][uint(commodity)]) >= quantity);
        balances_[msg.sender][uint(commodity)] -= int(quantity);
        balances_[to][uint(commodity)] += int(quantity);
    }

    function award(address to, Commodity commodity, uint quantity) public {
        require(msg.sender == creator_);
        balances_[to][uint(commodity)] += int(quantity);
    }

    function isTrue(bool input) external pure returns(bool) {
        return input;
    }

    function isFalse(bool input) external pure returns(bool) {
        return !input;
    }
}


contract BaseContract {
    event Killed();

    Marketplace public marketplace_;
    int public scale_;

    address public creator_;
    bool public alive_ = true;

    constructor(Marketplace marketplace, int scale) public {
        marketplace_ = marketplace;
        scale_ = scale;
        creator_ = msg.sender;
    }

    function proceed() public;

    function receive(Marketplace.Commodity commodity, int quantity) internal whenAlive {
        marketplace_.receive(commodity, quantity);
    }

    function kill() internal whenAlive {
        alive_ = false;
        emit Killed();
    }

    modifier whenAlive {
        require(alive_);
        _;
    }
}

