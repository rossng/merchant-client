pragma solidity ^0.4.20;


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

    address public owner_;

    mapping(address => ContractMetadata) public contracts_;

    mapping(address => mapping(uint => int)) public balances_;

    function Marketplace() public {
        balances_[msg.sender][uint(Commodity.USD)] = 0;
        balances_[msg.sender][uint(Commodity.GBP)] = 0;
        owner_ = msg.sender;
    }

    function signed(address contractAddress) public constant returns(bool) {
        return contracts_[contractAddress].signed;
    }

    function propose(BaseContract contractAddress, address to) public {
        require(contractAddress.owner_() == msg.sender); // is being requested by owner of contract
        require(!contracts_[contractAddress].signed); // has not already been signed
        contracts_[contractAddress] = ContractMetadata(msg.sender, to, false);
        emit Proposed(contractAddress, to);
    }

    function sign(address contractAddress) public {
        require(msg.sender == contracts_[contractAddress].holder);
        require(!contracts_[contractAddress].signed);
        contracts_[contractAddress].signed = true;
        emit Signed(contractAddress);
    }

    function receive(Commodity commodity, uint quantity) public {
        ContractMetadata storage c = contracts_[msg.sender];
        require(c.signed == true);
        balances_[c.counterparty][uint(commodity)] -= int(quantity);
        balances_[c.holder][uint(commodity)] += int(quantity);
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

    function transfer(address to, Commodity commodity, uint quantity) public {
        require(uint(balances_[msg.sender][uint(commodity)]) >= quantity);
        balances_[msg.sender][uint(commodity)] -= int(quantity);
        balances_[to][uint(commodity)] += int(quantity);
    }

    function award(address to, Commodity commodity, uint quantity) public {
        require(msg.sender == owner_);
        balances_[to][uint(commodity)] += int(quantity);
    }
}


contract BaseContract {
    event Killed();
    Marketplace public marketplace_;
    address public owner_;
    bool public alive_ = true;

    function BaseContract(Marketplace marketplace) public {
        marketplace_ = marketplace;
        owner_ = msg.sender;
    }

    function proceed() public;

    function receive(Marketplace.Commodity commodity, uint quantity) internal whenAlive {
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


contract Zero is BaseContract {
    function Zero(Marketplace marketplace) public BaseContract(marketplace) {
        kill();
    }
}


contract One is BaseContract {
    Marketplace.Commodity public commodity_;

    function One(Marketplace marketplace, Marketplace.Commodity commodity) public BaseContract(marketplace) {
        commodity_ = commodity;
    }

    function proceed() public whenAlive {
        marketplace_.receive(commodity_, 1);
        kill();
    }
}


contract MyContract is BaseContract {
    function MyContract(Marketplace marketplace) public BaseContract(marketplace) {}

    function proceed() public whenAlive {
        require(marketplace_.signed(address(this)));
        One next = new One(marketplace_, Marketplace.Commodity.USD);
        marketplace_.delegate(next);
        next.proceed();
        kill();
    }
}
