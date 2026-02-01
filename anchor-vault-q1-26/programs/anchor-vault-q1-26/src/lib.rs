use anchor_lang::prelude::*;

mod instructions;
use instructions::*;

declare_id!("795ui77wZyU8cTgxHntt83v9aiAfvVvyBws8xXyhT17S");

#[program]
pub mod anchor_vault_q1_26 {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.initialize(ctx.bumps)
    }

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        ctx.accounts.deposit(amount)
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        ctx.accounts.withdraw(amount)
    }

    pub fn close(ctx: Context<Close>) -> Result<()> {
        ctx.accounts.close()
    }
}

#[account]
#[derive(InitSpace)]
pub struct VaultState {
    pub vault_bump: u8,
    pub state_bump: u8,
}

#[error_code]
pub enum VaultError {
    #[msg("Insufficient funds for withdrawal")]
    InsufficientFunds,
}
