import { InboxStream, CommentStream, SubmissionStream } from "snoostorm";
import * as Snoowrap from "snoowrap";
const Web3 = require("web3");

const rpcURL = "http://34.245.24.81:8545";
const web3 = new Web3(rpcURL);
/*
fan plunge gasp media rare penalty cream vault lion alpha trumpet can
*/

class BettitBot{
  public async start() {

    const client = new Snoowrap({
      userAgent: "bettit",
      clientId: "jhJJvbKbFI6rEg",
      clientSecret: "kHJZeIKWbNn1VGWOADX89rhOErU",
      username: "IllVouchForYou",
      password:"123aoeu"
    });


    //const rpcURL = "http://127.0.0.1:8545";
    const rpcURL = "http://34.245.24.81:8545";

    // Options object is a Snoowrap Listing object, but with subreddit and pollTime options

    const comments = new CommentStream(client, { subreddit: "testingground4bots", limit: 10, pollTime: 2500 });
    comments.on("item", async (item ) => {
      console.log(item.body);

      let lowercasebody = item.body.toLowerCase();
      let index = lowercasebody.indexOf("lets have a wager!");

      if (index >=0) {
        let submissionRawName = item.name;
        let submissionName = submissionRawName.substr(3);

        console.log({foundSubmissionName: {submissionName ,submissionRawName }});

        let submission = client.getComment(submissionName);

        console.log("Got it")

        console.log({foundSubMission:
                     submission});

        let replyMsg = "place your bets! the address is " + eventContractAddress;

        console.log({submission_link_id: item.name});
        console.log({replyMsg});


        let result = submission.reply(replyMsg).then(
        console.log );

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
