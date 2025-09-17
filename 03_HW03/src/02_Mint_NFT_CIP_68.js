"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@meshsdk/core");
// import { metadata } from './metadata_token.js';
// import { recipients } from './recipients.js';
var provider = new core_1.BlockfrostProvider('previewz46Ivn8Z8LC2Rp23CajGlgNsN8Kljt2W');
var wallet = new core_1.MeshWallet({
    networkId: 0, // 0: testnet, 1: mainnet
    fetcher: provider,
    submitter: provider,
    key: {
        type: 'mnemonic',
        words: [
            "fall", "tennis", "main", "spot", "choose", "again", "miracle", "salon", "spawn",
            "effort", "toss", "disorder", "term", "replace", "arrive", "enact", "drink",
            "machine", "shuffle", "pear", "once", "boost", "drill", "upgrade"
        ],
    },
});
var balance = await wallet.getBalance();
console.log("Balance: ", balance);
