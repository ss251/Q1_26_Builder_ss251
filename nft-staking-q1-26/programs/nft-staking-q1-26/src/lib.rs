use anchor_lang::prelude::*;

pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use instructions::*;

declare_id!("HimF6bUv7jgEV8m4XKZL5JHpgYQnYpoAPr3F6kdNXJ5V");

#[program]
pub mod nft_staking_q1_26 {
    use super::*;

    pub fn init_config(ctx: Context<InitConfig>, reward_rate: u64) -> Result<()> {
        ctx.accounts.init_config(reward_rate, &ctx.bumps)
    }

    pub fn init_user(ctx: Context<InitializeUser>) -> Result<()> {
        ctx.accounts.initialize_user(&ctx.bumps)
    }

    pub fn stake(ctx: Context<Stake>) -> Result<()> {
        ctx.accounts.stake(&ctx.bumps)
    }

    pub fn unstake(ctx: Context<Unstake>) -> Result<()> {
        ctx.accounts.unstake()
    }
}
