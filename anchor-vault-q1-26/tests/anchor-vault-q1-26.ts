import { expect } from "chai";
import {
  createSolanaClient,
  createTransaction,
  address,
  LAMPORTS_PER_SOL,
  getProgramDerivedAddress,
  getAddressEncoder,
  AccountRole,
} from "gill";
import { loadKeypairSignerFromFile } from "gill/node";
import type { Address, KeyPairSigner, IInstruction } from "gill";

const PROGRAM_ID = address(
  "795ui77wZyU8cTgxHntt83v9aiAfvVvyBws8xXyhT17S"
);
const SYSTEM_PROGRAM = address("11111111111111111111111111111111");

// Instruction discriminators from the IDL
const DISCRIMINATORS = {
  initialize: Buffer.from([175, 175, 109, 31, 13, 152, 155, 237]),
  deposit: Buffer.from([242, 35, 198, 137, 82, 225, 242, 182]),
  withdraw: Buffer.from([183, 18, 70, 156, 148, 109, 161, 34]),
  close: Buffer.from([98, 165, 201, 177, 108, 65, 206, 96]),
};

function encodeU64(value: bigint): Buffer {
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64LE(value);
  return buf;
}

async function deriveVaultStatePDA(
  userAddress: Address
): Promise<[Address, number]> {
  const addressEncoder = getAddressEncoder();
  return await getProgramDerivedAddress({
    programAddress: PROGRAM_ID,
    seeds: [Buffer.from("state"), addressEncoder.encode(userAddress)],
  });
}

async function deriveVaultPDA(
  vaultStateAddress: Address
): Promise<[Address, number]> {
  const addressEncoder = getAddressEncoder();
  return await getProgramDerivedAddress({
    programAddress: PROGRAM_ID,
    seeds: [Buffer.from("vault"), addressEncoder.encode(vaultStateAddress)],
  });
}

function createInitializeInstruction(
  user: Address,
  vaultState: Address,
  vault: Address
): IInstruction {
  return {
    programAddress: PROGRAM_ID,
    accounts: [
      { address: user, role: AccountRole.WRITABLE_SIGNER },
      { address: vaultState, role: AccountRole.WRITABLE },
      { address: vault, role: AccountRole.WRITABLE },
      { address: SYSTEM_PROGRAM, role: AccountRole.READONLY },
    ],
    data: DISCRIMINATORS.initialize,
  };
}

function createDepositInstruction(
  user: Address,
  vault: Address,
  vaultState: Address,
  amount: bigint
): IInstruction {
  return {
    programAddress: PROGRAM_ID,
    accounts: [
      { address: user, role: AccountRole.WRITABLE_SIGNER },
      { address: vault, role: AccountRole.WRITABLE },
      { address: vaultState, role: AccountRole.READONLY },
      { address: SYSTEM_PROGRAM, role: AccountRole.READONLY },
    ],
    data: Buffer.concat([DISCRIMINATORS.deposit, encodeU64(amount)]),
  };
}

function createWithdrawInstruction(
  user: Address,
  vaultState: Address,
  vault: Address,
  amount: bigint
): IInstruction {
  return {
    programAddress: PROGRAM_ID,
    accounts: [
      { address: user, role: AccountRole.WRITABLE_SIGNER },
      { address: vaultState, role: AccountRole.WRITABLE },
      { address: vault, role: AccountRole.WRITABLE },
      { address: SYSTEM_PROGRAM, role: AccountRole.READONLY },
    ],
    data: Buffer.concat([DISCRIMINATORS.withdraw, encodeU64(amount)]),
  };
}

function createCloseInstruction(
  user: Address,
  vault: Address,
  vaultState: Address
): IInstruction {
  return {
    programAddress: PROGRAM_ID,
    accounts: [
      { address: user, role: AccountRole.WRITABLE_SIGNER },
      { address: vault, role: AccountRole.WRITABLE },
      { address: vaultState, role: AccountRole.WRITABLE },
      { address: SYSTEM_PROGRAM, role: AccountRole.READONLY },
    ],
    data: DISCRIMINATORS.close,
  };
}

describe("anchor-vault-q1-26", () => {
  const { rpc, sendAndConfirmTransaction } = createSolanaClient({
    urlOrMoniker: "localnet",
  });

  let user: KeyPairSigner;
  let vaultStatePDA: Address;
  let vaultPDA: Address;

  before(async () => {
    user = await loadKeypairSignerFromFile();
    console.log("User:", user.address);

    // Airdrop SOL to user
    const airdropSig = await rpc
      .requestAirdrop(user.address, BigInt(5 * LAMPORTS_PER_SOL))
      .send();
    console.log("Airdrop signature:", airdropSig);

    // Wait for airdrop to confirm
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const balance = await rpc.getBalance(user.address).send();
    console.log(
      "User balance:",
      Number(balance.value) / LAMPORTS_PER_SOL,
      "SOL"
    );

    // Derive PDAs
    [vaultStatePDA] = await deriveVaultStatePDA(user.address);
    [vaultPDA] = await deriveVaultPDA(vaultStatePDA);

    console.log("Vault State PDA:", vaultStatePDA);
    console.log("Vault PDA:", vaultPDA);
  });

  it("initializes the vault", async () => {
    const ix = createInitializeInstruction(
      user.address,
      vaultStatePDA,
      vaultPDA
    );

    const tx = createTransaction({
      version: "legacy",
      feePayer: user,
      instructions: [ix],
    });

    const sig = await sendAndConfirmTransaction(tx);
    console.log("Initialize tx:", sig);

    // Verify vault_state account exists
    const accountInfo = await rpc
      .getAccountInfo(vaultStatePDA, { encoding: "base64" })
      .send();
    expect(accountInfo.value).to.not.be.null;
    console.log("Vault state account created successfully");
  });

  it("deposits SOL into the vault", async () => {
    const depositAmount = BigInt(1 * LAMPORTS_PER_SOL);

    const vaultBalanceBefore = await rpc.getBalance(vaultPDA).send();

    const ix = createDepositInstruction(
      user.address,
      vaultPDA,
      vaultStatePDA,
      depositAmount
    );

    const tx = createTransaction({
      version: "legacy",
      feePayer: user,
      instructions: [ix],
    });

    const sig = await sendAndConfirmTransaction(tx);
    console.log("Deposit tx:", sig);

    const vaultBalanceAfter = await rpc.getBalance(vaultPDA).send();
    const deposited =
      BigInt(vaultBalanceAfter.value) - BigInt(vaultBalanceBefore.value);

    expect(deposited).to.equal(depositAmount);
    console.log(
      "Vault balance:",
      Number(vaultBalanceAfter.value) / LAMPORTS_PER_SOL,
      "SOL"
    );
  });

  it("withdraws SOL from the vault", async () => {
    const withdrawAmount = BigInt(0.5 * LAMPORTS_PER_SOL);

    const vaultBalanceBefore = await rpc.getBalance(vaultPDA).send();

    const ix = createWithdrawInstruction(
      user.address,
      vaultStatePDA,
      vaultPDA,
      withdrawAmount
    );

    const tx = createTransaction({
      version: "legacy",
      feePayer: user,
      instructions: [ix],
    });

    const sig = await sendAndConfirmTransaction(tx);
    console.log("Withdraw tx:", sig);

    const vaultBalanceAfter = await rpc.getBalance(vaultPDA).send();
    const withdrawn =
      BigInt(vaultBalanceBefore.value) - BigInt(vaultBalanceAfter.value);

    expect(withdrawn).to.equal(withdrawAmount);
    console.log(
      "Vault balance after withdraw:",
      Number(vaultBalanceAfter.value) / LAMPORTS_PER_SOL,
      "SOL"
    );
  });

  it("closes the vault", async () => {
    const ix = createCloseInstruction(user.address, vaultPDA, vaultStatePDA);

    const tx = createTransaction({
      version: "legacy",
      feePayer: user,
      instructions: [ix],
    });

    const sig = await sendAndConfirmTransaction(tx);
    console.log("Close tx:", sig);

    // Verify vault_state account is closed
    const accountInfo = await rpc
      .getAccountInfo(vaultStatePDA, { encoding: "base64" })
      .send();
    expect(accountInfo.value).to.be.null;

    // Verify vault is empty
    const vaultBalance = await rpc.getBalance(vaultPDA).send();
    expect(Number(vaultBalance.value)).to.equal(0);

    console.log("Vault closed successfully, all funds returned to user");
  });
});
