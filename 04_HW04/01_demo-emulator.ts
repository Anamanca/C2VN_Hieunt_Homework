import {describe, it} from 'vitest';
import * as fc from "fast-check";
import {Emulator, generateEmulatorAccount, Lucid} from "@lucid-evolution/lucid";

describe("Property test: Pay to address with random amounts", () => {
  it("should successfully send random amounts", async () => {
    await fc.assert(fc.asyncProperty(fc.bigInt(1_000_000n, 55_000_000n), async (amount) => {
      // Tạo test account với generateEmulatorAccount helper
      const testAccount = generateEmulatorAccount({
        lovelace: 70_000_000n, // 70 ADA
      });

      // Khởi tạo Emulator với test account
      const emulator = new Emulator([testAccount]);

      // Tạo Lucid instance với emulator và Custom network
      const lucid = await Lucid(emulator, "Custom");
      lucid.selectWallet.fromSeed(testAccount.seedPhrase);

      const recipient = "addr_test1qpuexzns2ze8g5csu30mnnk6gf2vx3kpwz2vcgvjsv7q3dr4mvw6eahqha5vj295mm0ugphljpesxaszfcff5hq9w63qrh0623";

      // Tạo và hoàn thành transaction
      const tx = await lucid
      .newTx()
      .pay.ToAddress(recipient, {lovelace: amount})
      .complete();

      // Ký và submit transaction
      const signedTx = await tx.sign.withWallet().complete();
      const txHash = await signedTx.submit();

      // Simulate block progression
      await emulator.awaitBlock(1);

      console.log("Transaction hash:", txHash);
      return true;
    }), {numRuns: 79});
  }, 60000); // timeout 60 seconds cho test
});