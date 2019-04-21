pragma solidity ^0.5.1;

contract BettitEvent {
    uint256 _bettingAmount = 1000000000000000; // 0.001 ETH
    uint256 _bettingClosingTime;
    string[] _allowedOutcomes;

    uint256 _outcomePercentageThreshold = 60;
    uint256 _minimumOutcomeReports = 3; // not used

    struct Bet {
        address payable senderAddress;
        string predictedOutcome;
        uint256 amount;
    }

    Bet[] _bets;
    mapping (address => string) _reportedOutcomes;
    uint256 _reportedOutcome1Count = 0;
    uint256 _reportedOutcome2Count = 0;
    uint256 _reportedOutcomeDrawCount = 0;

    constructor(uint256 bettingClosingTime, string memory allowedOutcome1, string memory allowedOutcome2) public {
        _bettingClosingTime = bettingClosingTime;
        _allowedOutcomes = ['draw', allowedOutcome1, allowedOutcome2];
    }

    function areStringsEqual(string memory string1, string memory string2) pure internal returns(bool) {
        if (keccak256(bytes(string1)) == keccak256(bytes(string2))) {
            return true;
        }

        return false;
    }

    function isAllowedOutcome(string memory outcome) internal view returns(bool) {
        for (uint256 i = 0; i < _allowedOutcomes.length; i++) {
            string memory allowedOutcome = _allowedOutcomes[i];

            if (areStringsEqual(allowedOutcome, outcome)) {
                return true;
            }
        }

        return false;
    }

    function bet(string memory outcome) payable public returns(bool) {
        // require (now < _bettingClosingTime, "This betting round has closed.");
        require (isAllowedOutcome(outcome), "Invalid outcome provided.");
        require (msg.value == _bettingAmount, "Invalid amount sent. Betting amount is 0.001");

        _bets.push(Bet({senderAddress: msg.sender, predictedOutcome: outcome, amount: _bettingAmount}));
        return true;
    }

    function sufficientOutcomesReported() internal view returns(bool) {
        if (totalOutcomeReports() >= _minimumOutcomeReports) {
            return true;
        }

        return false;
    }

    function payoutForOutcome(uint256 amountToPayPerUnitBetted, string memory outcome) internal {
        for (uint256 i = 0; i < _bets.length; i++) {
            if (areStringsEqual(_bets[i].predictedOutcome, outcome)) {
                _bets[i].senderAddress.transfer(amountToPayPerUnitBetted * _bets[i].amount);
            }
        }
    }

    function outcomePercentageThresholdReached() internal view returns (bool) {
        return ((_reportedOutcome1Count / totalOutcomeReports() * 100 > _outcomePercentageThreshold) ||
        (_reportedOutcome2Count / totalOutcomeReports() * 100 > _outcomePercentageThreshold) ||
        (_reportedOutcomeDrawCount / totalOutcomeReports() * 100 > _outcomePercentageThreshold));
    }

    function attemptPayout() internal returns(bool) {
        uint256 totalAmountBettedForOutcome1 = 0;
        uint256 totalAmountBettedForOutcome2 = 0;
        uint256 totalAmountBettedForOutcomeDraw = 0;

        for (uint256 i = 0; i < _bets.length; i++) {
            if (areStringsEqual(_bets[i].predictedOutcome, _allowedOutcomes[0])) {
                totalAmountBettedForOutcomeDraw += _bets[i].amount;
            }

            else if (areStringsEqual(_bets[i].predictedOutcome, _allowedOutcomes[1])) {
                totalAmountBettedForOutcome1 += _bets[i].amount;
            }

            else {
                totalAmountBettedForOutcome2 += _bets[i].amount;
            }
        }

        uint256 totalInPot = totalAmountBettedForOutcome1 + totalAmountBettedForOutcome2 + totalAmountBettedForOutcomeDraw;
        uint256 totalBettedForWinningOutcome = 0;
        string memory winningOutcome = '';

        if ((_reportedOutcome1Count > _reportedOutcome2Count) &&  (_reportedOutcome1Count > _reportedOutcomeDrawCount)) {
            totalBettedForWinningOutcome = totalAmountBettedForOutcome1;
            winningOutcome = _allowedOutcomes[1];
        }
        else if ((_reportedOutcome2Count > _reportedOutcome1Count) &&  (_reportedOutcome2Count > _reportedOutcomeDrawCount)) {
            totalBettedForWinningOutcome = totalAmountBettedForOutcome2;
            winningOutcome = _allowedOutcomes[2];
        }
        else {
            totalBettedForWinningOutcome = totalAmountBettedForOutcomeDraw;
            winningOutcome = _allowedOutcomes[0];
        }

        if (outcomePercentageThresholdReached() && sufficientOutcomesReported()) {
            uint256 amountToPayPerUnitBetted = totalInPot / totalBettedForWinningOutcome; // weighted distribution to winners
            payoutForOutcome(amountToPayPerUnitBetted, winningOutcome);
        }
    }

    function totalOutcomeReports() internal view returns (uint256) {
        return _reportedOutcome1Count + _reportedOutcome2Count + _reportedOutcomeDrawCount;
    }

    function reportOutcome(string memory outcome) public returns(bool) {
        // require (now > _bettingClosingTime, "This betting round is still in progress.");
        require (isAllowedOutcome(outcome), "Invalid outcome provided.");

        if (bytes(_reportedOutcomes[msg.sender]).length == 0) {
            _reportedOutcomes[msg.sender] = outcome;

            if (areStringsEqual(_allowedOutcomes[0], outcome)) {
                _reportedOutcomeDrawCount++;
            } else if (areStringsEqual(_allowedOutcomes[1], outcome)) {
                _reportedOutcome1Count++;
            } else {
                _reportedOutcome2Count++;
            }

            attemptPayout();

            return true;
        }

        return false;
    }
}
