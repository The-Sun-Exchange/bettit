import Veil from "veil-js/dist";

class Tester {
    veil: Veil;

    constructor(apiHost: string, mnemonic: string, address: string) {
        this.veil = new Veil(mnemonic, address, apiHost);
    }

    public async main() {
        const markets = await this.veil.getMarkets();
        console.log('Markets: ', markets);
        const myOrders = await this.veil.getUserOrders(markets[0]);
        console.log('myOrders: ', myOrders);
    }

    public async createOrder() {
        this.veil.createOrder();
    }
}

const apiHost: string = 'https://api.kovan.veil.market';
const mnemonic: string = 'turkey language supply square city dragon photo churn badge vague more service';
const address: string = '0x65eeC458fD7508d80bfBC1b67A0e3bd7CcaA9BB8'.toLowerCase();

let tester = new Tester(apiHost, mnemonic, address);

tester.main().then((result) => {
    console.log('Success!');
}).catch((error) => {
    console.log('Error: ', error);
});
