pragma solidity ^0.4.21;
pragma experimental ABIEncoderV2;

contract IntObservable {
    struct Value {
        int value;
        uint timestamp;
    }

    function getValueHistory() public returns(IntObservable.Value[]);
    function getValue() public view returns(int);
    function getTimestamp() public view returns(uint);

    function getFirstSince(function(int) external pure returns(bool) condition, uint sinceTimestamp) public returns(bool, uint);
}

contract BoolObservable {
    struct Value {
        bool value;
        uint timestamp;
    }

    function getValueHistory() public returns(BoolObservable.Value[]);
    function getValue() public view returns(bool);
    function getTimestamp() public view returns(uint);

    function getFirstSince(function(bool) external pure returns(bool) condition, uint sinceTimestamp) public returns(bool, uint);
}

contract UserBoolObservable is BoolObservable {
    BoolObservable.Value[] private valueHistory_;
    address authority_;

    event ValueUpdated(bool newValue);

    constructor(address authority, bool initialValue) public {
        valueHistory_.push(Value(initialValue, 0));
        authority_ = authority;
    }

    function getValueHistory() public returns (BoolObservable.Value[]) {
        return valueHistory_;
    }

    function getValue() public view returns (bool) {
        return valueHistory_[valueHistory_.length - 1].value;
    }

    function getTimestamp() public view returns (uint) {
        return valueHistory_[valueHistory_.length - 1].timestamp;
    }

    function setValue(bool value) public {
        valueHistory_.push(BoolObservable.Value(value, block.timestamp));
        emit ValueUpdated(value);
    }

    function getFirstSince(function(bool) external pure returns (bool) condition, uint sinceTimestamp) public returns (bool, uint) {
        uint currentTimestamp = 0;
        bool currentValue = valueHistory_[0].value;
        for (uint i = 0; i < valueHistory_.length; i++) {
            if (valueHistory_[i].timestamp < sinceTimestamp) {
                currentTimestamp = valueHistory_[i].timestamp;
                currentValue = valueHistory_[i].value;
                continue;
            } else {
                if (condition(currentValue)) {
                    return (true, sinceTimestamp);
                }
                currentTimestamp = valueHistory_[i].timestamp;
                currentValue = valueHistory_[i].value;
                if (condition(currentValue)) {
                    return (true, currentTimestamp);
                }
            }
        }
        return (false, 0);
    }
}



contract UserIntObservable is IntObservable {
    IntObservable.Value[] private valueHistory_;
    address authority_;

    event ValueUpdated(int newValue);

    constructor(address authority, int initialValue) public {
        valueHistory_.push(Value(initialValue, 0));
        authority_ = authority;
    }

    function getValueHistory() public returns (IntObservable.Value[]) {
        return valueHistory_;
    }

    function getValue() public view returns (int) {
        return valueHistory_[valueHistory_.length - 1].value;
    }

    function getTimestamp() public view returns (uint) {
        return valueHistory_[valueHistory_.length - 1].timestamp;
    }

    function setValue(int value) public {
        valueHistory_.push(IntObservable.Value(value, block.timestamp));
        emit ValueUpdated(value);
    }

    function getFirstSince(function(int) external pure returns (bool) condition, uint sinceTimestamp) public returns (bool, uint) {
        uint currentTimestamp = 0;
        int currentValue = valueHistory_[0].value;
        for (uint i = 0; i < valueHistory_.length; i++) {
            if (valueHistory_[i].timestamp < sinceTimestamp) {
                currentTimestamp = valueHistory_[i].timestamp;
                currentValue = valueHistory_[i].value;
                continue;
            } else {
                if (condition(currentValue)) {
                    return (true, sinceTimestamp);
                }
                currentTimestamp = valueHistory_[i].timestamp;
                currentValue = valueHistory_[i].value;
                if (condition(currentValue)) {
                    return (true, currentTimestamp);
                }
            }
        }
        return (false, 0);
    }
}
