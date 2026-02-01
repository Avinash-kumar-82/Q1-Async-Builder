use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{mint_to, Mint, MintTo, Token, TokenAccount},
};

use crate::state::{StakeConfig, UserAccount};

// #[derive(Accounts)]
// pub struct Claim<'info> {
// //TODO
// }

// impl<'info> Claim<'info> {
//     pub fn claim(&mut self) -> Result<()> {
//     //TODO
//     }
// }

#[derive(Accounts)]
pub struct Claim<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        init_if_needed,
        payer = user,
        associated_token::mint = reward_mint,
        associated_token::authority = user,
        associated_token::token_program = token_program
    )]
    pub rewards_ata: Account<'info, TokenAccount>,
    #[account(
        mut,
        seeds = [b"rewards", config.key().as_ref()],
        bump
    )]
    pub reward_mint: Account<'info, Mint>,
    #[account(
        seeds = [b"config".as_ref()],
        bump
    )]
    pub config: Account<'info, StakeConfig>,
    #[account(
        mut,
        seeds = [b"user", user.key().as_ref()],
        bump
    )]
    pub user_account: Account<'info, UserAccount>,
    pub system_program: Program<'info, System>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Program<'info, Token>

}

impl<'info> Claim<'info> {

    pub fn claim(&mut self) -> Result<()> {

        let cpi_program = self.token_program.to_account_info();

        let amount = ((self.user_account.points as f64) * 10e9) as u64;

        let signer_seeds: &[&[&[u8]]] = &[&[

            b"config",

            &[self.config.bump]
        ]];

        let cpi_accounts = MintTo {

            mint: self.reward_mint.to_account_info(),
            to: self.rewards_ata.to_account_info(),
            authority: self.config.to_account_info()
        };

        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);

        mint_to(cpi_ctx, amount as u64)?;

        self.user_account.points = 0;

        Ok(())
    }
}