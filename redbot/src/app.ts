import { InboxStream, CommentStream, SubmissionStream } from "snoostorm";
import * as Snoowrap from "snoowrap";
const Web3 = require("web3");

const rpcURL = "http://34.245.24.81:8545";
const web3 = new Web3(rpcURL);
/*
  fan plunge gasp media rare penalty cream vault lion alpha trumpet can
*/

var currentBettingContractAddress:string ;
var currentCommentName:string;

class BettitBot{
  public async start() {

    const client = new Snoowrap({
      userAgent: "bettit",
      clientId: "jhJJvbKbFI6rEg",
      clientSecret: "kHJZeIKWbNn1VGWOADX89rhOErU",
      username: "IllVouchForYou",
      password:"123aoeu"
    });



    const letsBetComments = new CommentStream(client, { subreddit: "testingground4bots", limit: 10, pollTime: 2500 });
    letsBetComments.on("item", async (item ) => {
      console.log(item.body);

      let lowercasebody = item.body.toLowerCase();

      let createBettingContractIndex = lowercasebody.indexOf("lets have a wager");
      if (createBettingContractIndex >=0) {
        let submissionRawName = item.name;

        currentCommentName = submissionRawName.substr(3);
        console.log({foundSubmissionName: {currentCommentName,submissionRawName }});

        let submission = client.getComment(currentCommentName);


        const url = "http://localhost:8000?currentCommentName=" + currentCommentName;
        let replyMsg =
          `Please go to <a href=${url}>${url}</a> and confirm your transaction in MetaMask after which punters can place their bets here.`;
        let result = submission.reply(replyMsg).then(console.log);
      }

      let bettingContracCreatedtIndex = lowercasebody.indexOf("betting contract address: ");
      if (bettingContracCreatedtIndex >=0) {
        currentBettingContractAddress = lowercasebody.substr(bettingContracCreatedtIndex+26,42  );
        console.log({currentBettingContractAddress });
      }

      let betIndex = lowercasebody.indexOf("betting on: ");
      if (betIndex >=0) {
        var bet = lowercasebody.substr(betIndex+ 12, 1  );
        console.log('bet');

        let submission = client.getComment(currentCommentName);

        let replyMsg =
          "Please go to http://localhost:8000/bet?bettitEventInstanceAddress="+ currentBettingContractAddress+" &outcome="
          + bet
          + " and press the bet button after which punters can place their bets here" ;
        console.log({replyMsg });

        let result = submission.reply(replyMsg).then(
          console.log );

        let scoreIndex = lowercasebody.indexOf("won!") - 2 ;
        if (scoreIndex >=0) {
          var outcome = lowercasebody.substr(scoreIndex,1);

          console.log({outcome});

          let submission = client.getComment(currentCommentName);

          let replyMsg =
            "Please go to http://localhost:8000/score?bettitEventInstanceAddress="+ currentBettingContractAddress+" &outcome="
            + bet
            + " and press the bet button after which punters can place their bets here" ;
          let result = submission.reply(replyMsg).then(
            console.log );
        }


      };
    });
  };
};

let bot:BettitBot = new BettitBot;

bot.start();


/*  //submission.reply("Yo yo yo!").then(console.log);
    web3.eth.getBlockNumber().then(
    (blockHeight:number)=>{
    let replyMsg = "the ethereum blockchain is: "+ blockHeight + " blocks high";
    console.log({submission_link_id: item.name});
    console.log({replyMsg});


    if (submission !== null){
    console.log({submission});
    submission.reply(replyMsg).then(()=>console.log("submitted!"));
    } else {
    console.log("could not find submission with name = " +item.name.substr(3) + "  raw= " +item.name.substr(3));
    }
    });
    }*/
