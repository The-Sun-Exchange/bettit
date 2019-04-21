pragma solidity ^0.5.1;
import "./BettitEvent.sol";

contract Bettit {
    int contractsCreated = 0;
    BettitEvent[] bettitEventContracts;

    constructor() public {
    }

    event newBettitEventContract(
        address contractAddress
    );

    function createEvent(uint256 expiryDate, string memory allowedOutcome1, string memory allowedOutcome2) public returns(address) {
        BettitEvent bettitEvent = new BettitEvent(expiryDate, allowedOutcome1, allowedOutcome2);
        bettitEventContracts.push(bettitEvent);
        address lastContractAddress = address(bettitEvent);
        emit newBettitEventContract(lastContractAddress);
        return lastContractAddress;
    }
}
