pragma solidity ^0.4.21;
pragma experimental ABIEncoderV2;

contract BoolObservable {
struct Value {
bool value;
uint timestamp;
}

function getValueHistory() public returns(BoolObservable.Value[]);
function getValue() public view returns(bool);
function getTimestamp() public view returns(uint);

function getFirstSince(function(bool) external pure returns(bool) condition, uint timestamp) public view returns(bool, uint);
}

contract AndBoolObservable {
BoolObservable b1_;
BoolObservable b2_;
BoolObservable.Value[] valueHistory_;

constructor(BoolObservable b1, BoolObservable b2) public {
b1_ = b1;
b2_ = b2;
}

function getValueHistory() public returns(BoolObservable.Value[]) {
BoolObservable.Value[] memory b1 = b1_.getValueHistory();
BoolObservable.Value[] memory b2 = b2_.getValueHistory();
valueHistory_.length = 0;

uint i = 0;
uint j = 0;

// Note: this will fail if both input observables do not start at time 0
// This is intended behaviour (for now)

while (i < b1.length && j < b2.length) {
if (b1[i].timestamp < b2[j].timestamp) {
valueHistory_.push(BoolObservable.Value(b1[i].value && b2[j-1].value, b1[i].timestamp));
i++;
} else if (b1[i].timestamp > b2[i].timestamp) {
valueHistory_.push(BoolObservable.Value(b1[i-1].value && b2[j].value, b1[j].timestamp));
j++;
} else {
valueHistory_.push(BoolObservable.Value(b1[i].value && b2[i].value, b1[i].timestamp));
i++;
j++;
}
}
while (i < b1.length) {
valueHistory_.push(BoolObservable.Value(b1[i].value && b2[j-1].value, b1[i].timestamp));
i++;
}
while (j < b2.length) {
valueHistory_.push(BoolObservable.Value(b1[i-1].value && b2[j].value, b1[j].timestamp));
j++;
}

return valueHistory_;
}
}

contract AfterBoolObservable is BoolObservable {
uint private time_;
BoolObservable.Value[] valueHistory_;

constructor(uint time) public {
time_ = time;
}

function getValueHistory() public returns(BoolObservable.Value[]) {
valueHistory_.length = 0;
if (block.timestamp < time_) {
valueHistory_.push(BoolObservable.Value(false, 0));
} else {
valueHistory_.push(BoolObservable.Value(false, 0));
valueHistory_.push(BoolObservable.Value(true, time_));
}
return valueHistory_;
}

function getValue() public view returns(bool) {
return block.timestamp < time_ ? false : true;
}

function getTimestamp() public view returns(uint) {
return block.timestamp < time_ ? 0 : time_;
}

function getFirstSince(function(bool) external pure returns(bool) condition, uint since) public view returns(bool, uint) {
if (now >= since) {
if (since < time_) {
if (condition(false)) {
return (true, since);
} else if (now >= time_ && condition(true)) {
return (true, time_);
} else {
return (false, 0);
}
} else {
if (condition(true)) {
return (true, since);
} else {
return (false, 0);
}
}
}
return (false, 0);
}
}

contract ConstantBoolObservable is BoolObservable {
BoolObservable.Value[] valueHistory_;

constructor(bool value) public {
valueHistory_.push(BoolObservable.Value(value, 0));
}

function getValueHistory() public returns(BoolObservable.Value[]) {
return valueHistory_;
}

function getValue() public view returns(bool) {
return valueHistory_[0].value;
}

function getTimestamp() public view returns(uint) {
return valueHistory_[0].timestamp;
}

function getFirstSince(function(bool) external pure returns(bool) condition, uint timestamp) public view returns(bool, uint) {
if (condition(valueHistory_[0].value)) {
return (true, 0);
} else {
return (false, 0);
}
}
}

contract UserBoolObservable is BoolObservable {
BoolObservable.Value[] private valueHistory_;
address authority_;

constructor(address authority, bool initialValue) public  {
valueHistory_.push(Value(initialValue, 0));
authority_ = authority;
}

function getValueHistory() public returns(BoolObservable.Value[]) {
return valueHistory_;
}


function getValue() public view returns(bool) {
return valueHistory_[valueHistory_.length - 1].value;
}

function getTimestamp() public view returns(uint) {
return valueHistory_[valueHistory_.length - 1].timestamp;
}

function setValue(bool value) public {
valueHistory_.push(BoolObservable.Value(value, block.timestamp));
}

function getFirstSince(function(bool) external pure returns(bool) condition, uint sinceTimestamp) public view returns(bool, uint) {
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

contract IntObservable {
struct Value {
int value;
uint timestamp;
}

Value[] public valueHistory_;

function getValue() public view returns(int);
function getTimestamp() public view returns(uint);
}

contract UserIntObservable is IntObservable {
address authority_;
constructor(address authority, int initialValue) public {
authority_ = authority;
setValue(initialValue);
}

function getValue() public view returns(int) {
return valueHistory_[valueHistory_.length - 1].value;
}

function getTimestamp() public view returns(uint) {
return valueHistory_[valueHistory_.length - 1].timestamp;
}

function setValue(int value) public {
valueHistory_.push(IntObservable.Value(value, block.timestamp));
}
}
