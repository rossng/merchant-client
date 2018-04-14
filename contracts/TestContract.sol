pragma solidity ^0.4.21;
pragma experimental ABIEncoderV2;
import {BaseContract, Marketplace} from './Marketplace.sol';

contract Scale_2 is BaseContract {
    WrapperContract public wrapper_;
    bool public until_;
    BoolObservable private untilObs_;
    uint acquiredTimestamp_;
    IntObservable private obs_;

    constructor(Marketplace marketplace, int scale, WrapperContract wrapper, bool until, BoolObservable untilObs) public BaseContract(marketplace, scale) {
        wrapper_ = wrapper;
        until_ = until;
        untilObs_ = untilObs;
        acquiredTimestamp_ = block.timestamp;
        obs_ = new ConstantIntObservable_1();
    }

    function proceed() public whenAlive {
        if (until_) {
            bool untilFulfilled;
            (untilFulfilled,) = untilObs_.getFirstSince(marketplace_.isTrue, acquiredTimestamp_);
            if (untilFulfilled) {
                kill();
                return;
            }
        }

        One_1 next = new One_1(marketplace_, scale_ * obs_.getValue(), wrapper_, false, BoolObservable(0));
        marketplace_.delegate(next);
        next.proceed();
        kill();
    }
}

contract One_1 is BaseContract {
    WrapperContract public wrapper_;
    bool public until_;
    BoolObservable private untilObs_;
    uint acquiredTimestamp_;

    constructor(Marketplace marketplace, int scale, WrapperContract wrapper, bool until, BoolObservable untilObs) public BaseContract(marketplace, scale) {
        wrapper_ = wrapper;
        until_ = until;
        untilObs_ = untilObs;
        acquiredTimestamp_ = block.timestamp;

    }

    function proceed() public whenAlive {
        if (until_) {
            bool untilFulfilled;
            (untilFulfilled,) = untilObs_.getFirstSince(marketplace_.isTrue, acquiredTimestamp_);
            if (untilFulfilled) {
                kill();
                return;
            }
        }

        marketplace_.receive(Marketplace.Commodity.GBP, scale_);
        kill();
    }
}

contract WrapperContract is BaseContract {


    constructor(Marketplace marketplace) public BaseContract(marketplace, 1) {
    }

    function proceed() public whenAlive {
        Scale_2 next = new Scale_2(marketplace_, 1, this, false, BoolObservable(0));
        marketplace_.delegate(next);
        next.proceed();
        kill();
    }
}

contract IntObservable {
    struct Value {
        int value;
        uint timestamp;
    }

    function getValueHistory() public returns (IntObservable.Value[]);

    function getValue() public view returns (int);

    function getTimestamp() public view returns (uint);

    function getFirstSince(function(int) external pure returns (bool) condition, uint sinceTimestamp) public returns (bool, uint);
}

contract BoolObservable {
    struct Value {
        bool value;
        uint timestamp;
    }

    function getValueHistory() public returns (BoolObservable.Value[]);

    function getValue() public view returns (bool);

    function getTimestamp() public view returns (uint);

    function getFirstSince(function(bool) external pure returns (bool) condition, uint sinceTimestamp) public returns (bool, uint);
}

contract ConstantIntObservable_1 is IntObservable {
    IntObservable.Value[] public valueHistory_;

    constructor() public {
        valueHistory_.push(IntObservable.Value(5, 0));
    }

    function getValueHistory() public returns (IntObservable.Value[]) {
        return valueHistory_;
    }

    function getValue() public view returns (int) {
        return valueHistory_[0].value;
    }

    function getTimestamp() public view returns (uint) {
        return valueHistory_[0].timestamp;
    }

    function getFirstSince(function(int) external pure returns (bool) condition, uint) public returns (bool, uint) {
        if (condition(valueHistory_[0].value)) {
            return (true, 0);
        } else {
            return (false, 0);
        }
    }
}

