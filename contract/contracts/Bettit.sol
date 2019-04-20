pragma solidity ^0.5.1;
import "./BettitEvent.sol";

contract Bettit {
    int contractsCreated = 0;

    constructor() public {
    }

    function createEvent(uint256 expiryDate, string memory allowedOutcome1, string memory allowedOutcome2) public returns(address) {
        return address(new BettitEvent(expiryDate, allowedOutcome1, allowedOutcome2));
    }
}
