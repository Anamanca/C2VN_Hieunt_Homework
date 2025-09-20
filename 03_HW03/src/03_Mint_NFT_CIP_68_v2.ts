import { MeshTxBuilder, ForgeScript, resolveScriptHash, stringToHex } from '@meshsdk/core';
import { BlockfrostProvider, MeshWallet, CIP68_100, CIP68_222, metadataToCip68 } from '@meshsdk/core';
import { Address } from "@emurgo/cardano-serialization-lib-nodejs";

const mnemonicSeed = [
      "fall", "tennis", "main", "spot", "choose", "again", "miracle", "salon", "spawn",
    ];

const provider = new BlockfrostProvider('previewz46Ivn8Z8LC2Rp23CajGlgNsN8Kljt2W');

const wallet = new MeshWallet({
  networkId: 0, // 0: testnet, 1: mainnet
  fetcher: provider,
  submitter: provider,
  key: {
    type: 'mnemonic',
    words: mnemonicSeed,
  },
});

const utxos = await wallet.getUtxos();

const changeAddress = await wallet.getChangeAddress();
// debug changeAddress
console.log("Change Address:", changeAddress);
try {
  Address.from_bech32(changeAddress);
  console.log("Change Address hợp lệ");
} catch (error) {
  console.error("Change Address không hợp lệ:", error);
}

const forgingScript = ForgeScript.withOneSignature(changeAddress);

const policyId = resolveScriptHash(forgingScript);
const tokenName = "C2VN-HieuNT-v3"; // name of the new token
const tokenNameHex = stringToHex(tokenName);

const userTokenMetadata = {
  name: tokenName,
  image: "ipfs://QmaeQmZLX3RFfWhKmwD1vMWbW5cDeRhrzYxKZTxLY6K7hK",
  mediaType: "image/jpg",
  description: "CIP-68 NFT, initial mint by HieuNT",
};

// recipient address
const RecipientAddress = 'addr_test1qpuexzns2ze8g5csu30mnnk6gf2vx3kpwz2vcgvjsv7q3dr4mvw6eahqha5vj295mm0ugphljpesxaszfcff5hq9w63qrh0623';
// debug recipient address
try {
  Address.from_bech32(RecipientAddress);
  console.log("Recipient Address hợp lệ");
} catch (error) {
  console.error("Recipient Address không hợp lệ:", error);
}

const txBuilder = new MeshTxBuilder({
  fetcher: provider, // get a provider https://meshjs.dev/providers
  submitter: provider, // su dung BlockfrostProvider de gui giao dich
  network: "preview", // Rõ ràng chỉ định mạng preview
  verbose: true,
});

try {
  const unsignedTx = await txBuilder
    .mint("1", policyId, CIP68_100(tokenNameHex))
    .mintingScript(forgingScript)
    .mint("1", policyId, CIP68_222(tokenNameHex))
    .mintingScript(forgingScript)
    .txOut(changeAddress, [{ unit: policyId + CIP68_100(tokenNameHex), quantity: "1" }])
    .txOutInlineDatumValue(metadataToCip68(userTokenMetadata))
    .txOut(RecipientAddress, [{ unit: policyId + CIP68_222(tokenNameHex), quantity: "1" }])
    .changeAddress(changeAddress)
    .selectUtxosFrom(utxos)
    .complete();

  const signedTx = await wallet.signTx(unsignedTx);
  const txHash = await wallet.submitTx(signedTx);

  console.log("-> Minted token:", tokenName);
  console.log("-> PolicyId ID:", policyId);
  console.log("-> Recipient address:", RecipientAddress);
  console.log("-> Transaction hash:", txHash);
} catch (error) {
  console.error("Lỗi khi xây dựng giao dịch:", error);
}