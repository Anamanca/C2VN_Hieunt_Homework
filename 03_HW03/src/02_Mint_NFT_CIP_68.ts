import {
  MeshWallet,
  MeshTxBuilder,
  Transaction,
  ForgeScript,
  BlockfrostProvider,
  resolveTxHash,
  resolveScriptHash,
  stringToHex,
} from '@meshsdk/core';

import type { Mint, AssetMetadata } from '@meshsdk/core';

// import { metadata } from './metadata_token.js';
// import { recipients } from './recipients.js';

const provider = new BlockfrostProvider('previewz46Ivn8Z8LC2Rp23CajGlgNsN8Kljt2W');

const wallet = new MeshWallet({
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

const balance = await wallet.getBalance();
console.log("Balance: ", balance);
