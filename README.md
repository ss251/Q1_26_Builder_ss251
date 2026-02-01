# Turbin3 Q1 2026 Builder Cohort

Monorepo for tracking progress

## Projects

- [solana-starter](./solana-starter) - Week 1 exercises: SPL tokens and NFTs
- [anchor-vault-q1-26](./anchor-vault-q1-26) - SOL vault program (deposit, withdraw, close)
- [anchor-escrow-q1-26](./anchor-escrow-q1-26) - Token escrow program (make, take, refund)
- [nft-staking-q1-26](./nft-staking-q1-26) - NFT staking program (delegate-based, points rewards)

---

<details>
<summary><strong>Week 1: Cluster1 Exercises</strong></summary>

### SPL Token (Week1Token - WK1)

| Item | Value |
|------|-------|
| Mint Address | [`AkTPrti4XiBHWp1JEj6wXvWPzSpyBgkjRrtALJNF7HUU`](https://explorer.solana.com/address/AkTPrti4XiBHWp1JEj6wXvWPzSpyBgkjRrtALJNF7HUU?cluster=devnet) |
| My ATA | [`83UCAVb3Lm9exRY7xCiwzMHTi5DmNZDACjtqPwMYDHEE`](https://explorer.solana.com/address/83UCAVb3Lm9exRY7xCiwzMHTi5DmNZDACjtqPwMYDHEE?cluster=devnet) |
| Decimals | 6 |

#### Transactions

| Action | Transaction |
|--------|-------------|
| Mint Tokens | [`2EXYWgEsBHmnr9An26w5VrnRNFN9jzuyeJWs6BuftfF5kkrry3H4onTgM6q5229j21dEdkB2BD2nG7cixw1Gtxwp`](https://explorer.solana.com/tx/2EXYWgEsBHmnr9An26w5VrnRNFN9jzuyeJWs6BuftfF5kkrry3H4onTgM6q5229j21dEdkB2BD2nG7cixw1Gtxwp?cluster=devnet) |
| Add Metadata | [`2FLnjMaGoxCYKKhZK7CYTf4tgpDwsffyPvfYR8B8nUAWQSa735F17p8NX3VGE4UYd8Vb8eWVwyzd6PPE4RdKVuUT`](https://explorer.solana.com/tx/2FLnjMaGoxCYKKhZK7CYTf4tgpDwsffyPvfYR8B8nUAWQSa735F17p8NX3VGE4UYd8Vb8eWVwyzd6PPE4RdKVuUT?cluster=devnet) |
| Transfer | [`4uCJ2xKgVDsTLGgmTnxfwgFHi3A13huoo2w2hBrxqKuPyDdACDTyP1ssvX6V5RKQYboDCNmwbdipvU5F6NcNinsE`](https://explorer.solana.com/tx/4uCJ2xKgVDsTLGgmTnxfwgFHi3A13huoo2w2hBrxqKuPyDdACDTyP1ssvX6V5RKQYboDCNmwbdipvU5F6NcNinsE?cluster=devnet) |

---

### NFT (MagicRug - MRUG)

| Item | Value |
|------|-------|
| Mint Address | [`3DsxiuUT884tbhzidU1eHRCnyBS5r1ZUTP7rcBSJP91z`](https://explorer.solana.com/address/3DsxiuUT884tbhzidU1eHRCnyBS5r1ZUTP7rcBSJP91z?cluster=devnet) |
| Image | [View on Irys](https://gateway.irys.xyz/EAWtfhd7gHZgouFbNXLjY81h8NxB2fxvmCYveA8j4JaM) |
| Metadata | [View on Irys](https://gateway.irys.xyz/ArLDpyveouc8xhmjRD8QHr6cktaqsP9kBd5PHdx8utrG) |
| Royalties | 1% |

#### Transaction

| Action | Transaction |
|--------|-------------|
| Mint NFT | [`5G14Ro4qBhM6CuniyNCgwv7pVfdUuRcLmJfbeC4bms6KawFRJjSyueSuN6XPgBa7tSZ2aqSBcBxKgvKU2w5JBBix`](https://explorer.solana.com/tx/5G14Ro4qBhM6CuniyNCgwv7pVfdUuRcLmJfbeC4bms6KawFRJjSyueSuN6XPgBa7tSZ2aqSBcBxKgvKU2w5JBBix?cluster=devnet) |

</details>

<details>
<summary><strong>Week 2-3: Anchor Programs</strong></summary>

### Vault

| Item | Value |
|------|-------|
| Program | `anchor-vault-q1-26` |
| Instructions | `initialize`, `deposit`, `withdraw`, `close` |
| Tests | 4/4 passing (gill + surfpool) |

### Escrow

| Item | Value |
|------|-------|
| Program | `anchor-escrow-q1-26` |
| Instructions | `make`, `take`, `refund` |
| Tests | 4/4 passing (gill + surfpool) |

### NFT Staking

| Item | Value |
|------|-------|
| Program | `nft-staking-q1-26` |
| Instructions | `init_config`, `init_user`, `stake`, `unstake` |
| Tests | 4/4 passing (gill + surfpool) |

</details>
