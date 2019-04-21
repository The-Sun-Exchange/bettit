import { InboxStream, CommentStream, SubmissionStream } from "snoostorm";
import * as Snoowrap from "snoowrap";
const Web3 = require("web3");

const rpcURL = "http://34.245.24.81:8545";
const web3 = new Web3(rpcURL);

/*
  fan plunge gasp media rare penalty cream vault lion alpha trumpet can
*/


class BettitBot{
  private currentBettingContractAddress:string ;
  private currentCommentName:string;
  private accountToUse = 0;

  public async start() {

    const client = new Snoowrap({
      userAgent: "bettit",
      clientId: "jhJJvbKbFI6rEg",
      clientSecret: "kHJZeIKWbNn1VGWOADX89rhOErU",
      username: "IllVouchForYou",
      password:"123aoeu"
    });

    const letsBetComments = new CommentStream(client, { subreddit: "testingground4bots", limit: 10, pollTime: 5000 });
    letsBetComments.on("item", async (item ) => {

      let lowercasebody = item.body.toLowerCase();

      let createBettingContractIndex = item.body.indexOf("Wager");
      if (createBettingContractIndex >=0) {
        let submissionRawName = item.name;

        this.currentCommentName = submissionRawName.substr(3);

        let submission = client.getComment(this.currentCommentName);


        const url = "http://localhost:8000?currentCommentName=" + this.currentCommentName;
        let replyMsg =
              `Please go to [${url}](${url}) and confirm your transaction in MetaMask after which punters can place their bets here.`;
        let result = submission.reply(replyMsg).then();
      }

      let bettingContracCreatedtIndex = lowercasebody.indexOf("betting contract address: ");
      if (bettingContracCreatedtIndex >=0) {
        this.currentBettingContractAddress = lowercasebody.substr(bettingContracCreatedtIndex+26,42  );
      }

      let betIndex = lowercasebody.indexOf("betting on: ");
      if (betIndex >=0) {
        var bet = item.body.substr(betIndex+ 12, 1  );
        console.log('bet');

        let submission = client.getComment(this.currentCommentName);

        this.accountToUse++;
        if (this.accountToUse > 2)this.accountToUse = 0;

        const url = "http://localhost:8000/bet?bettitEventInstanceAddress=" + this.currentBettingContractAddress + "&outcome=" + bet +"&account=" + this.accountToUse;
        let replyMsg = `Please go to [${url}](${url}) and authorize the bet in MetaMask.`;
        console.log({replyMsg });

        let result = submission.reply(replyMsg).then(console.log);
      };

        let scoreIndex = lowercasebody.indexOf("won!") - 2 ;
        if (scoreIndex >=0) {
            var outcome = lowercasebody.substr(scoreIndex,1);

            let submission = client.getComment(this.currentCommentName);

            const url = "http://localhost:8000/score?bettitEventInstanceAddress=" + this.currentBettingContractAddress + "&outcome=" + outcome + "&account=" + this.accountToUse;
            let replyMsg = `Please go to [${url}](${url}) and authorize the result in MetaMask.`;
            let result = submission.reply(replyMsg).then(console.log);
        }
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
