use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct StakeConfig {
    pub authority: Pubkey,
    pub reward_mint: Pubkey,
    pub collection: Pubkey,
    pub reward_rate: u64,
    pub is_paused: bool,
    pub total_staked: u64,
    pub bump: u8,
}
