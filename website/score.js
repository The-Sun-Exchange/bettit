function score() {
  const urlParams = new URLSearchParams(window.location.search);
  let bettitEventInstanceAddress = urlParams.get("bettitEventInstanceAddress");
  let outcome = urlParams.get("outcome").toUpperCase();
  let nextAccount = urlParams.get("account");

  if (typeof web3 === "undefined") {
    document.getElementById("error").innerHTML = "MetaMask is not installed";
  }

  web3.eth.getAccounts(function(err, accounts) {
    console.log({ accounts });
    if (err != null) {
      console.log(err);
    } else if (accounts.length === 0) {
      document.getElementById("error").innerHTML = "MetaMask is locked";
    } else {
      web3.eth.getBalance(accounts[0], function(error, result) {
        if (!error && result) {
          let bettitAbi = [
            {
              constant: false,
              inputs: [
                {
                  name: "outcome",
                  type: "string"
                }
              ],
              name: "bet",
              outputs: [
                {
                  name: "",
                  type: "bool"
                }
              ],
              payable: true,
              stateMutability: "payable",
              type: "function"
            },
            {
              constant: false,
              inputs: [
                {
                  name: "outcome",
                  type: "string"
                }
              ],
              name: "reportOutcome",
              outputs: [
                {
                  name: "",
                  type: "bool"
                }
              ],
              payable: false,
              stateMutability: "nonpayable",
              type: "function"
            },
            {
              inputs: [
                {
                  name: "bettingClosingTime",
                  type: "uint256"
                },
                {
                  name: "allowedOutcome1",
                  type: "string"
                },
                {
                  name: "allowedOutcome2",
                  type: "string"
                }
              ],
              payable: false,
              stateMutability: "nonpayable",
              type: "constructor"
            }
          ];

          const eth = new Eth(web3.currentProvider);
          const contract = new EthContract(eth);

          const BettitEvent = contract(bettitAbi);
          const bettitEvent = BettitEvent.at(bettitEventInstanceAddress);

          console.log("Using Account " + nextAccount);

          bettitEvent
            .reportOutcome(outcome, { from: accounts[0] })
            .then(betResult => {
              document.getElementById("score_result").innerHTML = betResult;
            });
        } else {
          console.error(error);
        }
        return false;
      });
    }
  });
}
