use anchor_lang::prelude::*;

#[error_code]
pub enum StakingError {
    #[msg("Staking is paused")]
    StakingPaused,
    #[msg("Maximum stake limit reached")]
    MaxStakeReached,
    #[msg("NFT is not staked")]
    NotStaked,
    #[msg("Minimum stake duration not met")]
    MinimumStakeDurationNotMet,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Invalid owner")]
    InvalidOwner,
}
