function getCurrentRedditCommentName() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("currentCommentName");
}

function postAddressMessageToReddit (address) {
  const client = new Snoowrap({
    userAgent: "bettit",
    clientId: "jhJJvbKbFI6rEg",
    clientSecret: "kHJZeIKWbNn1VGWOADX89rhOErU",
    username: "IllVouchForYou",
    password:"123aoeu"
  });

  const currentRedditCommentName = getCurrentRedditCommentName();
  let submission = client.getComment(currentRedditCommentName);
  let replyMsg = "Betting Contract Address: " + address;
  let result = submission.reply(replyMsg).then((result) => console.log(result));
}

function createBettingEvent() {
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
                { name: "expiryDate", type: "uint256" },
                { name: "allowedOutcome1", type: "string" },
                { name: "allowedOutcome2", type: "string" }
              ],
              name: "createEvent",
              outputs: [{ name: "", type: "address" }],
              payable: false,
              stateMutability: "nonpayable",
              type: "function"
            },
            {
              inputs: [],
              payable: false,
              stateMutability: "nonpayable",
              type: "constructor"
            },
            {
              anonymous: false,
              inputs: [
                { indexed: false, name: "contractAddress", type: "address" }
              ],
              name: "newBettitEventContract",
              type: "event"
            }
          ];

          let bettitInstanceAddress =
            "0x29972532a8cec0ae770b90ea33417fefc0c9d0bd";

          const eth = new Eth(web3.currentProvider);
          const contract = new EthContract(eth);

          const Bettit = contract(bettitAbi);
          const bettit = Bettit.at(bettitInstanceAddress);

          bettit
            .createEvent(1587429735, "A", "B", { from: accounts[0] })
            .then(createEventResult => {
              document.getElementById(
                "transaction_hash"
              ).innerHTML = createEventResult;
            });

          let event = bettit.newBettitEventContract();
          event.new({ toBlock: "latest" }).then((err, result) => {
            event.watch((err, result) => {
              let newBettitEventContractAddress = result[0].data.contractAddress;
              postAddressMessageToReddit(newBettitEventContractAddress);

              if (error) {
                console.log({ filter_watch_error: err });
              }

              document.getElementById("event_address").innerHTML = newBettitEventContractAddress;

              event.uninstall().then(result => {
                console.log({ filter_uninstall_result: result });
              });
            });
          });
        } else {
          console.error(error);
        }

        return false;
      });
    }
  });
}
