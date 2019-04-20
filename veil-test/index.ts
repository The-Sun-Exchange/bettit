import {encodeParams, VeilError} from "veil-js/dist";
import {MnemonicWalletSubprovider} from "@0x/subproviders";
import Web3ProviderEngine = require("web3-provider-engine");
import {Web3Wrapper} from "@0x/web3-wrapper";
import {utils} from "ethers";
const { camelizeKeys } = require("humps");
import fetch from "node-fetch";



class Tester {
    provider: Web3ProviderEngine;
    address: string;
    apiHost: string;
    jwt: string;

    constructor(apiHost: string, mnemonic: string, address: string) {
        this.apiHost = apiHost;
        if (mnemonic) this.provider = this.getProvider(mnemonic);
        this.address = address;
    }

    getProvider(mnemonic: string) {
        const provider = new Web3ProviderEngine();
        provider.addProvider(new MnemonicWalletSubprovider({mnemonic}));

        // web3-provider-engine prevents requests from going out before you do this
        (provider as any)._ready.go();

        return provider;
    }

    async fetch(
        url: string,
        params: any = {},
        method: "POST" | "GET" | "DELETE" = "GET"
    ) {
        if (method === "GET") url = url + "?" + encodeParams(params);
        const response = await fetch(url, {
            method,
            body: method !== "GET" ? JSON.stringify(params) : undefined,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                ...(this.jwt ? { Authorization: `Bearer ${this.jwt}` } : {})
            }
        });
        const json = await response.json();
        if (json.errors) throw new VeilError(json.errors, url);
        return camelizeKeys(json.data);
    }

    async createSessionChallenge() {
        const url = `${this.apiHost}/api/v1/session_challenges`;
        const challenge: { uid: string } = await this.fetch(url, {}, "POST");
        return challenge;
    }


    async createSession(params: {
        challengeUid: string;
        signature: string;
        message: string;
    }) {
        const url = `${this.apiHost}/api/v1/sessions`;
        const session: { token: string } = await this.fetch(url, params, "POST");
        return session;
    }

    async authenticate() {
        if (!this.provider || !this.address)
            throw new VeilError([
                "You tried calling an authenticated method without passing a mnemonic and address to the Veil constructor"
            ]);
        const challenge = await this.createSessionChallenge();
        const web3 = new Web3Wrapper(this.provider);
        const signature = await web3.signMessageAsync(
            this.address,
            utils.hexlify(utils.toUtf8Bytes(challenge.uid))
        );
        const session = await this.createSession({
            signature,
            challengeUid: challenge.uid,
            message: challenge.uid
        });
        this.jwt = session.token;
        return true;
    }
}

const apiHost: string = 'https://api.kovan.veil.market';
const mnemonic: string = 'turkey language supply square city dragon photo churn badge vague more service';
const address: string = '0x65eeC458fD7508d80bfBC1b67A0e3bd7CcaA9BB8'.toLowerCase();


let tester = new Tester(apiHost, mnemonic, address);

tester.authenticate().then((result) => {
    console.log('Result: ' , result);
}).catch((error) => {
    console.log('Error: ', error);
});



/*
// Without authentication
const veil = new Veil();
const markets = await veil.getMarkets();
console.log(markets); // { results: [{ slug: "...", ... }], total: 35, ... }

// With authentication
// Note: you must have registered on Veil using this address
const mnemonic =
  "unveil unveil unveil unveil unveil unveil unveil unveil unveil unveil unveil unveil";
const address = "0x5b5eae94bf37ff266955e46fdd38932346cc67e8";
const veil = new Veil(mnemonic, address);
const myOrders = await veil.getUserOrders(markets[0]);
*/
