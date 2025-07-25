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
// deno run --allow-all unlockAssets.ts
//
// For more information about lucid , visit here
// 
//
// check deno version library : deno info https://deno.land/x/lucid/mod.ts

import { Blockfrost, Lucid, Data, Addresses, paymentCredentialOf, Constr,
    SpendingValidator, UTxO, TxHash, Redeemer,
 } from "https://deno.land/x/lucid@0.20.11/mod.ts";

import { fromText } from "https://deno.land/x/lucid@0.20.11/mod.ts";

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
//const secretSeed = await Deno.readTextFile("seed.ts");
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

// Async function to unlock assets from smart contract using UTxOs and redeemer
async function unlockAssests(
    ourUtxos: UTxO[], // List of unspent transaction outputs
    { validator, redeemer }: { validator: SpendingValidator; redeemer: Redeemer } // Validator script and redeemer
): Promise<TxHash> {

    console.log ("Da vao funtion unlockAssests")
    // Create and complete transaction to unlock assets
    const tx = await lucid
        .newTx()
        .collectFrom(ourUtxos, redeemer) // Collect UTxOs with redeemer
        .addSigner(publicKeyHash) // Add wallet as signer
        .attachScript(validator) // Attach Plutus validator
        .commit();
    
    console.log ("Xay dung Tx thanh cong")
    // Sign and finalize the transaction
    const signedTx = await tx.sign().commit();
    console.log ("Ký thành công, đợi submit")
    // Submit transaction and return its hash
    return signedTx.submit();
}

// Main async function to execute the logic
async function main() {
    // Fetch all UTxOs at the contract address
    const scriptUTxOs = await lucid.utxosAt(SM_Address);

    // Filter UTxOs has datum matches the wallet's public key hash locked Assets
    const utxos = scriptUTxOs.filter((utxo) => {
        try {
            const temp = Data.from<Datum>(utxo.datum ?? '', Datum); // Parse datum
            if (temp.owner === publicKeyHash) {
                return true; // Include UTxO if owner matches
            }
            return false;
        } catch (e) {
            console.log(e); // Log errors during datum parsing
            return false;
        }
    });

    console.log ("Dia chi vi gui:", addr)
    console.log ("Find locked UTxO: ", utxos)

    // Create redeemer with "Hello world!" in hex format
    const redeemer = Data.to(new Constr(0, [fromText("Hello world!")]));
    
    // Unlock assets from filtered UTxOs using the validator and redeemer
    const txHash = await unlockAssests(utxos, { validator: SM_Script, redeemer });

    // Wait for transaction confirmation on the blockchain
    await lucid.awaitTx(txHash);

    // Log transaction hash and redeemer
    console.log(`tx hash: ${txHash}\nredeemer: ${redeemer}`);
}

// Run the main function
main();