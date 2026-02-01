use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{revoke, Revoke, Token},
    token_interface::{Mint, TokenAccount},
};

use crate::{
    constants::*,
    error::StakingError,
    state::{StakeAccount, StakeConfig, UserAccount},
};

#[derive(Accounts)]
pub struct Unstake<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        mut,
        seeds = [USER_ACCOUNT_SEED, user.key().as_ref()],
        bump = user_account.bump,
        constraint = user_account.owner == user.key() @ StakingError::Unauthorized,
    )]
    pub user_account: Account<'info, UserAccount>,
    #[account(
        mut,
        seeds = [STAKE_CONFIG_SEED],
        bump = stake_config.bump,
    )]
    pub stake_config: Account<'info, StakeConfig>,
    #[account(
        mut,
        seeds = [STAKE_ACCOUNT_SEED, nft_mint.key().as_ref()],
        bump = stake_account.bump,
        constraint = stake_account.owner == user.key() @ StakingError::Unauthorized,
        close = user
    )]
    pub stake_account: Account<'info, StakeAccount>,
    pub nft_mint: InterfaceAccount<'info, Mint>,
    #[account(
        mut,
        associated_token::mint = nft_mint,
        associated_token::authority = user,
    )]
    pub nft_token_account: InterfaceAccount<'info, TokenAccount>,
    #[account(
        seeds = [b"metadata", metadata_program.key().as_ref(), nft_mint.key().as_ref()],
        seeds::program = metadata_program.key(),
        bump,
    )]
    /// CHECK: Metadata account derived from seeds
    pub metadata: UncheckedAccount<'info>,
    #[account(
        seeds = [b"metadata", metadata_program.key().as_ref(), nft_mint.key().as_ref(), b"edition"],
        seeds::program = metadata_program.key(),
        bump,
    )]
    /// CHECK: Master edition account derived from seeds
    pub master_edition: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    /// CHECK: Metaplex metadata program
    pub metadata_program: UncheckedAccount<'info>,
}

impl<'info> Unstake<'info> {
    pub fn unstake(&mut self) -> Result<()> {
        require!(self.stake_account.is_staked, StakingError::NotStaked);

        let current_time = Clock::get()?.unix_timestamp;
        let stake_duration = current_time - self.stake_account.stake_time;
        require!(
            stake_duration >= MIN_STAKE_DURATION,
            StakingError::MinimumStakeDurationNotMet
        );

        let days_staked = (stake_duration / 86400) as u64;
        let points_earned = days_staked.saturating_mul(self.stake_config.reward_rate);
        self.user_account.reward_claimed += points_earned;

        let cpi_accounts = Revoke {
            source: self.nft_token_account.to_account_info(),
            authority: self.user.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(self.token_program.to_account_info(), cpi_accounts);
        revoke(cpi_ctx)?;

        self.user_account.total_staked = self.user_account.total_staked.saturating_sub(1);
        self.user_account.last_claim_time = current_time;
        self.stake_config.total_staked = self.stake_config.total_staked.saturating_sub(1);

        Ok(())
    }
}
