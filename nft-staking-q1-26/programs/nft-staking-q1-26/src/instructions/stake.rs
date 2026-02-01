use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{approve, Approve, Token},
    token_interface::{Mint, TokenAccount},
};

use crate::{
    constants::*,
    error::StakingError,
    state::{StakeAccount, StakeConfig, UserAccount},
};

#[derive(Accounts)]
pub struct Stake<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        mut,
        seeds = [USER_ACCOUNT_SEED, user.key().as_ref()],
        bump = user_account.bump,
    )]
    pub user_account: Account<'info, UserAccount>,
    #[account(
        mut,
        seeds = [STAKE_CONFIG_SEED],
        bump = stake_config.bump,
    )]
    pub stake_config: Account<'info, StakeConfig>,
    #[account(
        init,
        payer = user,
        space = 8 + StakeAccount::INIT_SPACE,
        seeds = [STAKE_ACCOUNT_SEED, nft_mint.key().as_ref()],
        bump
    )]
    pub stake_account: Account<'info, StakeAccount>,
    pub nft_mint: InterfaceAccount<'info, Mint>,
    #[account(
        mut,
        associated_token::mint = nft_mint,
        associated_token::authority = user,
        constraint = nft_token_account.amount == 1 @ StakingError::InvalidOwner
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

impl<'info> Stake<'info> {
    pub fn stake(&mut self, bumps: &StakeBumps) -> Result<()> {
        require!(!self.stake_config.is_paused, StakingError::StakingPaused);
        require!(
            self.user_account.total_staked < MAX_NFTS_PER_USER as u64,
            StakingError::MaxStakeReached
        );

        let cpi_accounts = Approve {
            to: self.nft_token_account.to_account_info(),
            delegate: self.stake_config.to_account_info(),
            authority: self.user.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(self.token_program.to_account_info(), cpi_accounts);
        approve(cpi_ctx, 1)?;

        let current_time = Clock::get()?.unix_timestamp;
        self.stake_account.set_inner(StakeAccount {
            owner: self.user.key(),
            nft_mint: self.nft_mint.key(),
            stake_time: current_time,
            last_claim_time: current_time,
            is_staked: true,
            bump: bumps.stake_account,
        });

        self.user_account.total_staked += 1;
        self.stake_config.total_staked += 1;

        Ok(())
    }
}
