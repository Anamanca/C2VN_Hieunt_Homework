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

const UpdateMetadata = {
  name: tokenName,
  image: "ipfs://QmaeQmZLX3RFfWhKmwD1vMWbW5cDeRhrzYxKZTxLY6K7hK",
  mediaType: "image/jpg",
  description: "CIP-68 NFT, updated metadata by HieuNT",
};

const txBuilder = new MeshTxBuilder({
  fetcher: provider, // get a provider https://meshjs.dev/providers
  submitter: provider, // su dung BlockfrostProvider de gui giao dich
  network: "preview", // Rõ ràng chỉ định mạng preview
  verbose: true,
});
//    .txIn('a0a2f6f7a76594e22395d0d49ef78a759b5e9b49e09da82deb75247ebd123912','0') // Sử dụng hàm để tìm UTxO với dataHash cụ thể
try {
  const unsignedTx = await txBuilder
    .txOut(changeAddress, [{ unit: policyId + CIP68_100(tokenNameHex), quantity: "1" }])
    .txOutInlineDatumValue(metadataToCip68(UpdateMetadata))
    .changeAddress(changeAddress)
    .selectUtxosFrom(utxos)
    .complete();

  const signedTx = await wallet.signTx(unsignedTx);
  const txHash = await wallet.submitTx(signedTx);

  console.log("-> Update token:", tokenName);
  console.log("-> PolicyId ID:", policyId);
  console.log("-> Recipient address:", changeAddress);
  console.log("-> Transaction hash:", txHash);
} catch (error) {
  console.error("Lỗi khi xây dựng giao dịch:", error);
}