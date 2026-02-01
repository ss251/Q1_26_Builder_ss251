use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct UserAccount {
    pub owner: Pubkey,
    pub total_staked: u64,
    pub reward_claimed: u64,
    pub last_claim_time: i64,
    pub bump: u8,
}
