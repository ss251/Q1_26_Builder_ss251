use anchor_lang::prelude::*;
use anchor_spl::token_interface::Mint;

use crate::{constants::*, state::StakeConfig};

#[derive(Accounts)]
pub struct InitConfig<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        init,
        payer = authority,
        space = 8 + StakeConfig::INIT_SPACE,
        seeds = [STAKE_CONFIG_SEED],
        bump,
    )]
    pub stake_config: Account<'info, StakeConfig>,
    pub reward_mint: InterfaceAccount<'info, Mint>,
    pub collection: InterfaceAccount<'info, Mint>,
    pub system_program: Program<'info, System>,
}

impl<'info> InitConfig<'info> {
    pub fn init_config(&mut self, reward_rate: u64, bumps: &InitConfigBumps) -> Result<()> {
        self.stake_config.set_inner(StakeConfig {
            authority: self.authority.key(),
            reward_mint: self.reward_mint.key(),
            collection: self.collection.key(),
            reward_rate,
            is_paused: false,
            total_staked: 0,
            bump: bumps.stake_config,
        });
        Ok(())
    }
}
