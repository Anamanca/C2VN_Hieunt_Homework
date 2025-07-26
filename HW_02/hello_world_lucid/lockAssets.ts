//-------- This is demo lucid interact
//
// Step 1: essential install in Visual code
// curl -fsSL https://deno.land/install.sh | sh
// -> check deno version : deno -version
// link referance : https://docs.deno.com/runtime/getting_started/installation/
//
// Step 2: Register Blockfrost API account
// https://blockfrost.io/
//
// Step 3: Running command
// deno run --allow-all lockAssets.ts
//
// For more information about lucid , visit here
// 
//
// check deno version library : deno info https://deno.land/x/lucid/mod.ts

import { Blockfrost, Lucid, Data, Addresses, paymentCredentialOf, } from "https://deno.land/x/lucid@0.20.11/mod.ts";

// Lucid khong the lay bien moi truong truc tiep, nen can import them thu vien ho tro
import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";
config({ export: true });
// -------------------------------------

const BLOCKFROST_API_KEY = Deno.env.get("BLOCKFROST_API_KEY");
const SEED_PHRASE = Deno.env.get("SEED_PHRASE_1");
const SM_SCRIPT = Deno.env.get("SM_SCRIPT");

// Khởi tạo Lucid với Blockfrost (thay YOUR_BLOCKFROST_PROJECT_ID bằng ID của bạn)
const lucid = new Lucid({
  provider: new Blockfrost(
    "https://cardano-preview.blockfrost.io/api/v0",
    BLOCKFROST_API_KEY, // Step 2
  ),
});

// Chọn ví (giả sử bạn có private key hoặc seed phrase)
lucid.selectWalletFromSeed(SEED_PHRASE);
const addr = await lucid.wallet.address();
const publicKeyHash = paymentCredentialOf(addr).hash;

// Define smart contract script from environment variable
const SM_Script: SpendingValidator = {
    type: "PlutusV2",
    script: SM_SCRIPT,
};

// Tạo địa chỉ smart contract
const SM_Address = Addresses.scriptToAddress("Preview", SM_Script);

// Define datum structure with an owner field (string)
const Datum = Data.Object({
    owner: Data.String,
});

// Create static TypeScript type for datum
type Datum = Data.Static<typeof Datum>;
//Deno.exit(0);

// Async function to lock assets (lovelace) with datum into smart contract
async function lockAssets(
    lovelace: bigint, // Amount to lock in lovelace
    { datum }: { datum: string } // Datum to attach to the transaction
): Promise<TxHash> {
    // Create and complete transaction to lock assets with datum

    const tx = await lucid
        .newTx()
        .payToContract(SM_Address, { Inline: datum }, { lovelace: lovelace })
        .commit();
    
    // Sign and finalize the transaction
    const signedTx = await tx.sign().commit();
    
    // Submit transaction and return its hash
    const txHash = await signedTx.submit();

    return txHash;
}

// Main async function to execute the logic
async function main() {
    // Create datum with wallet's public key hash (or default if undefined)
    const datum = Data.to<Datum>({
        owner: publicKeyHash ?? '00000000000000000000000000000000000000000000000000000000',
    }, Datum);
 
    console.log ("Dia chi vi lock Assets:", addr)
    // Lock 7,000,000 lovelace with the datum
    const txHash = await lockAssets(7000000n, { datum });

    // Log transaction hash and datum
    console.log(`tx hash: ${txHash}\ndatum: ${datum}`);
}

// Run the main function
main();
