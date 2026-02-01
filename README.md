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
<summary><strong>Week 2: Vault, Escrow, NFT Staking</strong></summary>

### Vault

| Item | Value |
|------|-------|
| Program ID | [`795ui77wZyU8cTgxHntt83v9aiAfvVvyBws8xXyhT17S`](https://explorer.solana.com/address/795ui77wZyU8cTgxHntt83v9aiAfvVvyBws8xXyhT17S?cluster=devnet) |
| Instructions | `initialize`, `deposit`, `withdraw`, `close` |
| Tests | 4/4 passing (gill + surfpool) |

#### Transactions

| Action | Transaction |
|--------|-------------|
| Deploy | [`5BbByHLXj38yrbDATgL3Bkf9NPJ8RuKjEtJH1KHJpnyztZM1BbpnNp3oZtTFb4RY2haMDaBS5pWWVpqFEeW12u47`](https://explorer.solana.com/tx/5BbByHLXj38yrbDATgL3Bkf9NPJ8RuKjEtJH1KHJpnyztZM1BbpnNp3oZtTFb4RY2haMDaBS5pWWVpqFEeW12u47?cluster=devnet) |
| Initialize | [`358U5YHAjfABC9MTmMncEod9M4RKNiDJWgnUQhA6Ws2y93svC4KX1dv7QFQXGRPXwsNWx3tRNJM6JvKfhpSDWZuS`](https://explorer.solana.com/tx/358U5YHAjfABC9MTmMncEod9M4RKNiDJWgnUQhA6Ws2y93svC4KX1dv7QFQXGRPXwsNWx3tRNJM6JvKfhpSDWZuS?cluster=devnet) |
| Deposit | [`4c5ss1NndDwHa23UHFttuvnzB174xyxprmWTGYiCcSUfBA6a2dv8VuTbxmRFkosvxzaLYgTkkMhH2dxvd5YPffzJ`](https://explorer.solana.com/tx/4c5ss1NndDwHa23UHFttuvnzB174xyxprmWTGYiCcSUfBA6a2dv8VuTbxmRFkosvxzaLYgTkkMhH2dxvd5YPffzJ?cluster=devnet) |
| Withdraw | [`2FbEi7nHNJZABzpjUrKW6RqnotemCjP8bp157xaoNH3g37M4WwCYHTvm1Rz5RpvTGZxdAxBjnsey1gvUuwfcdAp7`](https://explorer.solana.com/tx/2FbEi7nHNJZABzpjUrKW6RqnotemCjP8bp157xaoNH3g37M4WwCYHTvm1Rz5RpvTGZxdAxBjnsey1gvUuwfcdAp7?cluster=devnet) |
| Close | [`5JYTF3dDHkjemyyhX8UhPVsZoWqY9VK4NuaXJo1EnCrjkga78ARpPWYhmHvWLVRc9zp2qA2arpeDc7UiLme25Eyo`](https://explorer.solana.com/tx/5JYTF3dDHkjemyyhX8UhPVsZoWqY9VK4NuaXJo1EnCrjkga78ARpPWYhmHvWLVRc9zp2qA2arpeDc7UiLme25Eyo?cluster=devnet) |

---

### Escrow

| Item | Value |
|------|-------|
| Program ID | [`677U8Q9nAyas6JaKkercgVifkcwpuZrP6RUimosfKaHZ`](https://explorer.solana.com/address/677U8Q9nAyas6JaKkercgVifkcwpuZrP6RUimosfKaHZ?cluster=devnet) |
| Instructions | `make`, `take`, `refund` |
| Tests | 4/4 passing (gill + surfpool) |

#### Transactions

| Action | Transaction |
|--------|-------------|
| Deploy | [`4sF8Fjx9kMQpwgW3v5JawKe94g4bqgoCCpiEBpLZ1xA82nmyBESn4TCTxLUfWQU74P9bbj6U2wPweshNJpXkYFGT`](https://explorer.solana.com/tx/4sF8Fjx9kMQpwgW3v5JawKe94g4bqgoCCpiEBpLZ1xA82nmyBESn4TCTxLUfWQU74P9bbj6U2wPweshNJpXkYFGT?cluster=devnet) |
| Make | [`uai9ABd9Zm1dwYVxj35JYfGwgWqibtxQSc23chU3eJaQVn9HwjqGrDrs87wXEjsqXb82DdCFXmQQUns8kwNcRT1`](https://explorer.solana.com/tx/uai9ABd9Zm1dwYVxj35JYfGwgWqibtxQSc23chU3eJaQVn9HwjqGrDrs87wXEjsqXb82DdCFXmQQUns8kwNcRT1?cluster=devnet) |
| Take | [`3rNVbHowQcY5mStx3eAhHQdqPJkbp12hZFEjTFPyzwC3Zy9R29Tq47iNQHbVmM37XSYSmo45hdTH8PTdZAdBY8fx`](https://explorer.solana.com/tx/3rNVbHowQcY5mStx3eAhHQdqPJkbp12hZFEjTFPyzwC3Zy9R29Tq47iNQHbVmM37XSYSmo45hdTH8PTdZAdBY8fx?cluster=devnet) |

---

### NFT Staking

| Item | Value |
|------|-------|
| Program ID | [`HimF6bUv7jgEV8m4XKZL5JHpgYQnYpoAPr3F6kdNXJ5V`](https://explorer.solana.com/address/HimF6bUv7jgEV8m4XKZL5JHpgYQnYpoAPr3F6kdNXJ5V?cluster=devnet) |
| Instructions | `init_config`, `init_user`, `stake`, `unstake` |
| Tests | 4/4 passing (gill + surfpool) |

#### Transactions

| Action | Transaction |
|--------|-------------|
| Deploy | [`2onRY3WDc5DmFRXWcoQAj6MJsp3GvuQvbyQu76SRUszH4fnVq9YvB1DGh1eCiNNU9VAjzYdLhzNY9o577E7LaMNT`](https://explorer.solana.com/tx/2onRY3WDc5DmFRXWcoQAj6MJsp3GvuQvbyQu76SRUszH4fnVq9YvB1DGh1eCiNNU9VAjzYdLhzNY9o577E7LaMNT?cluster=devnet) |
| Init Config | [`4DKUBw9HtFM2CpyqFkU9j9RyYncrUABJFZPKTyGEPx5PsGXHmp1syYcGDvUpu1tWi5zvayKRGCbv2ivUfwdyjepT`](https://explorer.solana.com/tx/4DKUBw9HtFM2CpyqFkU9j9RyYncrUABJFZPKTyGEPx5PsGXHmp1syYcGDvUpu1tWi5zvayKRGCbv2ivUfwdyjepT?cluster=devnet) |
| Init User | [`XqzmHKEPbyzSGxS6BkFD15hyTHfKQaRzRji1ufdFWnMshmYrnjgE3f1dtwgEyhLjJm8TNvFosBTWKGx9HXeEw6u`](https://explorer.solana.com/tx/XqzmHKEPbyzSGxS6BkFD15hyTHfKQaRzRji1ufdFWnMshmYrnjgE3f1dtwgEyhLjJm8TNvFosBTWKGx9HXeEw6u?cluster=devnet) |
| Stake | [`ESMR6obwEUXYbiENaw1Eub8gD3ThHnf1TMvrEty9aM8WJ8H4entDjoNbXwz9eBfGmttUSMjz7hoFcTEqtg4xbdr`](https://explorer.solana.com/tx/ESMR6obwEUXYbiENaw1Eub8gD3ThHnf1TMvrEty9aM8WJ8H4entDjoNbXwz9eBfGmttUSMjz7hoFcTEqtg4xbdr?cluster=devnet) |

</details>
