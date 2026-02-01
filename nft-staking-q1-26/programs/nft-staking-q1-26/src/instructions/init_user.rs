use anchor_lang::prelude::*;

use crate::{constants::*, state::UserAccount};

#[derive(Accounts)]
pub struct InitializeUser<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        init,
        payer = user,
        space = 8 + UserAccount::INIT_SPACE,
        seeds = [USER_ACCOUNT_SEED, user.key().as_ref()],
        bump
    )]
    pub user_account: Account<'info, UserAccount>,
    pub system_program: Program<'info, System>,
}

impl<'info> InitializeUser<'info> {
    pub fn initialize_user(&mut self, bumps: &InitializeUserBumps) -> Result<()> {
        self.user_account.set_inner(UserAccount {
            owner: self.user.key(),
            total_staked: 0,
            reward_claimed: 0,
            last_claim_time: Clock::get()?.unix_timestamp,
            bump: bumps.user_account,
        });
        Ok(())
    }
}
