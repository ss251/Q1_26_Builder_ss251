import { expect } from "chai";
import {
  createSolanaClient,
  createTransaction,
  address,
  LAMPORTS_PER_SOL,
  getProgramDerivedAddress,
  getAddressEncoder,
  AccountRole,
  generateKeyPairSigner,
} from "gill";
import { loadKeypairSignerFromFile } from "gill/node";
import type { Address, KeyPairSigner, IInstruction } from "gill";

// Program addresses
const PROGRAM_ID = address(
  "677U8Q9nAyas6JaKkercgVifkcwpuZrP6RUimosfKaHZ"
);
const SYSTEM_PROGRAM = address("11111111111111111111111111111111");
const TOKEN_PROGRAM = address(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);
const ATA_PROGRAM = address(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);

const MINT_SIZE = 82;
const DECIMALS = 6;

// IDL discriminators
const DISC = {
  make: Buffer.from([138, 227, 232, 77, 223, 166, 96, 197]),
  refund: Buffer.from([2, 96, 183, 251, 63, 208, 46, 46]),
  take: Buffer.from([149, 226, 52, 104, 6, 142, 230, 39]),
};

// --- Encoding helpers ---

function encodeU32LE(n: number): Buffer {
  const buf = Buffer.alloc(4);
  buf.writeUInt32LE(n);
  return buf;
}

function encodeU64(value: bigint): Buffer {
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64LE(value);
  return buf;
}

const addrEnc = getAddressEncoder();

function encodeAddr(a: Address): Buffer {
  return Buffer.from(addrEnc.encode(a));
}

// --- PDA helpers ---

async function deriveATA(
  owner: Address,
  mint: Address
): Promise<Address> {
  const [ata] = await getProgramDerivedAddress({
    programAddress: ATA_PROGRAM,
    seeds: [
      encodeAddr(owner),
      encodeAddr(TOKEN_PROGRAM),
      encodeAddr(mint),
    ],
  });
  return ata;
}

async function deriveEscrowPDA(
  maker: Address,
  seed: bigint
): Promise<[Address, number]> {
  return getProgramDerivedAddress({
    programAddress: PROGRAM_ID,
    seeds: [Buffer.from("escrow"), encodeAddr(maker), encodeU64(seed)],
  });
}

// --- SPL Token setup helpers ---

function systemCreateAccountIx(
  payer: KeyPairSigner,
  newAccount: KeyPairSigner,
  lamports: bigint,
  space: number,
  owner: Address
): IInstruction {
  return {
    programAddress: SYSTEM_PROGRAM,
    accounts: [
      { address: payer.address, role: AccountRole.WRITABLE_SIGNER },
      {
        address: newAccount.address,
        role: AccountRole.WRITABLE_SIGNER,
        signer: newAccount,
      } as any,
    ],
    data: Buffer.concat([
      encodeU32LE(0),
      encodeU64(lamports),
      encodeU64(BigInt(space)),
      encodeAddr(owner),
    ]),
  };
}

function tokenInitMint2Ix(
  mint: Address,
  decimals: number,
  authority: Address
): IInstruction {
  return {
    programAddress: TOKEN_PROGRAM,
    accounts: [{ address: mint, role: AccountRole.WRITABLE }],
    data: Buffer.concat([
      Buffer.from([20]),
      Buffer.from([decimals]),
      encodeAddr(authority),
      Buffer.from([0]),
      Buffer.alloc(32),
    ]),
  };
}

function ataCreateIdempotentIx(
  payer: KeyPairSigner,
  ata: Address,
  owner: Address,
  mint: Address
): IInstruction {
  return {
    programAddress: ATA_PROGRAM,
    accounts: [
      { address: payer.address, role: AccountRole.WRITABLE_SIGNER },
      { address: ata, role: AccountRole.WRITABLE },
      { address: owner, role: AccountRole.READONLY },
      { address: mint, role: AccountRole.READONLY },
      { address: SYSTEM_PROGRAM, role: AccountRole.READONLY },
      { address: TOKEN_PROGRAM, role: AccountRole.READONLY },
    ],
    data: Buffer.from([1]),
  };
}

function tokenMintToIx(
  mint: Address,
  dest: Address,
  authority: Address,
  amount: bigint
): IInstruction {
  return {
    programAddress: TOKEN_PROGRAM,
    accounts: [
      { address: mint, role: AccountRole.WRITABLE },
      { address: dest, role: AccountRole.WRITABLE },
      { address: authority, role: AccountRole.READONLY_SIGNER },
    ],
    data: Buffer.concat([Buffer.from([7]), encodeU64(amount)]),
  };
}

// --- Escrow program instruction builders ---

function createMakeIx(
  maker: Address,
  mintA: Address,
  mintB: Address,
  makerAtaA: Address,
  escrow: Address,
  vault: Address,
  seed: bigint,
  deposit: bigint,
  receive: bigint
): IInstruction {
  return {
    programAddress: PROGRAM_ID,
    accounts: [
      { address: maker, role: AccountRole.WRITABLE_SIGNER },
      { address: mintA, role: AccountRole.READONLY },
      { address: mintB, role: AccountRole.READONLY },
      { address: makerAtaA, role: AccountRole.WRITABLE },
      { address: escrow, role: AccountRole.WRITABLE },
      { address: vault, role: AccountRole.WRITABLE },
      { address: ATA_PROGRAM, role: AccountRole.READONLY },
      { address: TOKEN_PROGRAM, role: AccountRole.READONLY },
      { address: SYSTEM_PROGRAM, role: AccountRole.READONLY },
    ],
    data: Buffer.concat([
      DISC.make,
      encodeU64(seed),
      encodeU64(deposit),
      encodeU64(receive),
    ]),
  };
}

function createTakeIx(
  taker: Address,
  maker: Address,
  mintA: Address,
  mintB: Address,
  makerAtaB: Address,
  takerAtaA: Address,
  takerAtaB: Address,
  escrow: Address,
  vault: Address
): IInstruction {
  return {
    programAddress: PROGRAM_ID,
    accounts: [
      { address: taker, role: AccountRole.WRITABLE_SIGNER },
      { address: maker, role: AccountRole.WRITABLE },
      { address: mintA, role: AccountRole.READONLY },
      { address: mintB, role: AccountRole.READONLY },
      { address: makerAtaB, role: AccountRole.WRITABLE },
      { address: takerAtaA, role: AccountRole.WRITABLE },
      { address: takerAtaB, role: AccountRole.WRITABLE },
      { address: escrow, role: AccountRole.WRITABLE },
      { address: vault, role: AccountRole.WRITABLE },
      { address: ATA_PROGRAM, role: AccountRole.READONLY },
      { address: TOKEN_PROGRAM, role: AccountRole.READONLY },
      { address: SYSTEM_PROGRAM, role: AccountRole.READONLY },
    ],
    data: DISC.take,
  };
}

function createRefundIx(
  maker: Address,
  mintA: Address,
  makerAtaA: Address,
  escrow: Address,
  vault: Address
): IInstruction {
  return {
    programAddress: PROGRAM_ID,
    accounts: [
      { address: maker, role: AccountRole.WRITABLE_SIGNER },
      { address: mintA, role: AccountRole.READONLY },
      { address: makerAtaA, role: AccountRole.WRITABLE },
      { address: escrow, role: AccountRole.WRITABLE },
      { address: vault, role: AccountRole.WRITABLE },
      { address: ATA_PROGRAM, role: AccountRole.READONLY },
      { address: TOKEN_PROGRAM, role: AccountRole.READONLY },
      { address: SYSTEM_PROGRAM, role: AccountRole.READONLY },
    ],
    data: DISC.refund,
  };
}

// --- Tests ---

describe("anchor-escrow-q1-26", () => {
  const { rpc, sendAndConfirmTransaction } = createSolanaClient({
    urlOrMoniker: "localnet",
  });

  let maker: KeyPairSigner;
  let taker: KeyPairSigner;
  let mintASigner: KeyPairSigner;
  let mintBSigner: KeyPairSigner;
  let mintA: Address;
  let mintB: Address;
  let makerAtaA: Address;
  let makerAtaB: Address;
  let takerAtaA: Address;
  let takerAtaB: Address;
  let escrow1: Address;
  let vault1: Address;
  let escrow2: Address;
  let vault2: Address;

  const SEED_1 = 1n;
  const SEED_2 = 2n;
  const DEPOSIT = 100_000_000n; // 100 tokens (6 decimals)
  const RECEIVE = 50_000_000n; // 50 tokens
  const INITIAL = 1_000_000_000n; // 1000 tokens

  before(async () => {
    // Generate signers
    maker = await loadKeypairSignerFromFile();
    taker = await generateKeyPairSigner();
    mintASigner = await generateKeyPairSigner();
    mintBSigner = await generateKeyPairSigner();
    mintA = mintASigner.address;
    mintB = mintBSigner.address;

    console.log("Maker:", maker.address);
    console.log("Taker:", taker.address);
    console.log("Mint A:", mintA);
    console.log("Mint B:", mintB);

    // Airdrop SOL to both maker and taker
    await rpc
      .requestAirdrop(maker.address, BigInt(10 * LAMPORTS_PER_SOL))
      .send();
    await rpc
      .requestAirdrop(taker.address, BigInt(10 * LAMPORTS_PER_SOL))
      .send();
    await new Promise((r) => setTimeout(r, 2000));

    // Get rent for mint accounts
    const mintRent = await rpc
      .getMinimumBalanceForRentExemption(BigInt(MINT_SIZE))
      .send();

    // Create Mint A
    const createMintATx = createTransaction({
      version: "legacy",
      feePayer: maker,
      instructions: [
        systemCreateAccountIx(
          maker,
          mintASigner,
          BigInt(mintRent),
          MINT_SIZE,
          TOKEN_PROGRAM
        ),
        tokenInitMint2Ix(mintA, DECIMALS, maker.address),
      ],
    });
    await sendAndConfirmTransaction(createMintATx);
    console.log("Mint A created");

    // Create Mint B
    const createMintBTx = createTransaction({
      version: "legacy",
      feePayer: maker,
      instructions: [
        systemCreateAccountIx(
          maker,
          mintBSigner,
          BigInt(mintRent),
          MINT_SIZE,
          TOKEN_PROGRAM
        ),
        tokenInitMint2Ix(mintB, DECIMALS, maker.address),
      ],
    });
    await sendAndConfirmTransaction(createMintBTx);
    console.log("Mint B created");

    // Derive ATAs
    makerAtaA = await deriveATA(maker.address, mintA);
    makerAtaB = await deriveATA(maker.address, mintB);
    takerAtaA = await deriveATA(taker.address, mintA);
    takerAtaB = await deriveATA(taker.address, mintB);

    // Create ATAs (makerAtaB will be created by take instruction via init_if_needed)
    const atasTx = createTransaction({
      version: "legacy",
      feePayer: maker,
      instructions: [
        ataCreateIdempotentIx(maker, makerAtaA, maker.address, mintA),
        ataCreateIdempotentIx(maker, takerAtaA, taker.address, mintA),
        ataCreateIdempotentIx(maker, takerAtaB, taker.address, mintB),
      ],
    });
    await sendAndConfirmTransaction(atasTx);
    console.log("ATAs created");

    // Mint tokens: token A to maker, token B to taker
    const mintTx = createTransaction({
      version: "legacy",
      feePayer: maker,
      instructions: [
        tokenMintToIx(mintA, makerAtaA, maker.address, INITIAL),
        tokenMintToIx(mintB, takerAtaB, maker.address, INITIAL),
      ],
    });
    await sendAndConfirmTransaction(mintTx);
    console.log("Tokens minted");

    // Derive escrow PDAs
    [escrow1] = await deriveEscrowPDA(maker.address, SEED_1);
    vault1 = await deriveATA(escrow1, mintA);
    [escrow2] = await deriveEscrowPDA(maker.address, SEED_2);
    vault2 = await deriveATA(escrow2, mintA);

    console.log("Escrow 1:", escrow1, "Vault 1:", vault1);
    console.log("Escrow 2:", escrow2, "Vault 2:", vault2);
    console.log("Setup complete\n");
  });

  it("makes an escrow (deposit 100 token A, expect 50 token B)", async () => {
    const ix = createMakeIx(
      maker.address,
      mintA,
      mintB,
      makerAtaA,
      escrow1,
      vault1,
      SEED_1,
      DEPOSIT,
      RECEIVE
    );
    const tx = createTransaction({
      version: "legacy",
      feePayer: maker,
      instructions: [ix],
    });
    const sig = await sendAndConfirmTransaction(tx);
    console.log("Make tx:", sig);

    // Verify escrow account exists
    const escrowInfo = await rpc
      .getAccountInfo(escrow1, { encoding: "base64" })
      .send();
    expect(escrowInfo.value).to.not.be.null;

    // Verify vault has deposited tokens
    const vaultBal = await rpc.getTokenAccountBalance(vault1).send();
    expect(BigInt(vaultBal.value.amount)).to.equal(DEPOSIT);
    console.log("Vault balance:", vaultBal.value.uiAmountString);
  });

  it("taker fills the escrow", async () => {
    const ix = createTakeIx(
      taker.address,
      maker.address,
      mintA,
      mintB,
      makerAtaB,
      takerAtaA,
      takerAtaB,
      escrow1,
      vault1
    );
    const tx = createTransaction({
      version: "legacy",
      feePayer: taker,
      instructions: [ix],
    });
    const sig = await sendAndConfirmTransaction(tx);
    console.log("Take tx:", sig);

    // Escrow should be closed
    const escrowInfo = await rpc
      .getAccountInfo(escrow1, { encoding: "base64" })
      .send();
    expect(escrowInfo.value).to.be.null;

    // Taker received deposit amount of token A
    const takerABal = await rpc.getTokenAccountBalance(takerAtaA).send();
    expect(BigInt(takerABal.value.amount)).to.equal(DEPOSIT);

    // Maker received receive amount of token B (init_if_needed created makerAtaB)
    const makerBBal = await rpc.getTokenAccountBalance(makerAtaB).send();
    expect(BigInt(makerBBal.value.amount)).to.equal(RECEIVE);

    console.log(
      "Trade complete - taker got:",
      takerABal.value.uiAmountString,
      "A, maker got:",
      makerBBal.value.uiAmountString,
      "B"
    );
  });

  it("makes another escrow for refund test", async () => {
    const ix = createMakeIx(
      maker.address,
      mintA,
      mintB,
      makerAtaA,
      escrow2,
      vault2,
      SEED_2,
      DEPOSIT,
      RECEIVE
    );
    const tx = createTransaction({
      version: "legacy",
      feePayer: maker,
      instructions: [ix],
    });
    await sendAndConfirmTransaction(tx);

    const vaultBal = await rpc.getTokenAccountBalance(vault2).send();
    expect(BigInt(vaultBal.value.amount)).to.equal(DEPOSIT);
    console.log(
      "Second escrow created, vault balance:",
      vaultBal.value.uiAmountString
    );
  });

  it("maker refunds the escrow", async () => {
    const beforeBal = await rpc.getTokenAccountBalance(makerAtaA).send();

    const ix = createRefundIx(
      maker.address,
      mintA,
      makerAtaA,
      escrow2,
      vault2
    );
    const tx = createTransaction({
      version: "legacy",
      feePayer: maker,
      instructions: [ix],
    });
    await sendAndConfirmTransaction(tx);

    // Escrow should be closed
    const escrowInfo = await rpc
      .getAccountInfo(escrow2, { encoding: "base64" })
      .send();
    expect(escrowInfo.value).to.be.null;

    // Maker got tokens back
    const afterBal = await rpc.getTokenAccountBalance(makerAtaA).send();
    const recovered =
      BigInt(afterBal.value.amount) - BigInt(beforeBal.value.amount);
    expect(recovered).to.equal(DEPOSIT);
    console.log(
      "Refund complete, recovered:",
      recovered.toString(),
      "raw tokens"
    );
  });
});
