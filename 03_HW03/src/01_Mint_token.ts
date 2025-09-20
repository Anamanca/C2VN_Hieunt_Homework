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

// const balance = await wallet.getBalance();
// console.log("Balance: ", balance);
//
//--------------------------- Xay dung giao dich mint 1 NFT ------------
//
// Địa chỉ người nhận token
const recipientAddress = 'addr_test1qpuexzns2ze8g5csu30mnnk6gf2vx3kpwz2vcgvjsv7q3dr4mvw6eahqha5vj295mm0ugphljpesxaszfcff5hq9w63qrh0623';

//const recipientAddress = 'addr_test1qzhc49ugvgy8ecn9yc5fqgf6ul93p5zax064zjhelzeu0fmpdncxll30wjh4dlws5t5l9tcrhzj62hdrr79ryxw3hyqqzfgrhx';

// Lấy địa chỉ người gửi
const walletAddress = await wallet.getChangeAddress();
// Tạo forging script với 1 chữ ký từ địa chỉ ví
const forgingScript = ForgeScript.withOneSignature(walletAddress);
// Lấy policy ID từ forging script
const policyId = resolveScriptHash(forgingScript);

// Khai báo tên token và metadata
const assetName = 'TestMeshToken04';
const assetMetadata = {
  name: "Test Mesh Token #04",
  image: "ipfs://QmbsU3bTQU9a8yZuDjE2bd9LLY2cgUQZco1mGD3p3DNKR4",
  mediaType: "image/png",
  description: "Homework #1 in Assignment 03.",
  artist: "This token was minted by Mesh.",
};
// Chuyển tên token sang định dạng hex
const tokenNameHex = stringToHex(assetName);
const assetId = `${policyId}${tokenNameHex}`;

// Tạo giao dịch
const tx = new Transaction({ initiator: wallet });
// Bước 1: Mint 600 token
const asset: Mint = {
  assetName: assetName,
  assetQuantity: '600',
  metadata: assetMetadata,
  label: '721', // Chuẩn CIP-721 (NFT hoặc token)
};

tx.mintAsset(forgingScript, asset);

// Bước 2: Gửi 500 token đến địa chỉ B
tx.sendAssets(
  recipientAddress,
  [
    {
      unit: assetId,
      quantity: '500'
    }
  ]
);

// Bước 3: Xây dựng, ký và gửi giao dịch
async function executeTransaction() {
  try {
    // Xây dựng giao dịch
    const unsignedTx = await tx.build();

    // Ký giao dịch
    const signedTx = await wallet.signTx(unsignedTx);

    // Gửi giao dịch lên blockchain
    const txHash = await wallet.submitTx(signedTx);
    console.log('Transaction successful! TxHash:', txHash);

    // In log để submit
    console.log(`Sent 500 ${assetName} to ${recipientAddress}`);
    console.log('Policy ID:', policyId);
    console.log('Asset ID:', assetId);
    console.log('TxHash:', txHash);
  } catch (error) {
    console.error('Error executing transaction:', error);
  }
}

executeTransaction().catch((error) => {
  console.error('Unexpected error:', error);
});