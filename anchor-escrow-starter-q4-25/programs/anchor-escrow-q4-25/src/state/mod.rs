use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Escrow {
    pub seed: u64,//hold seeds of of escrow for particular wallet why we take u64 ,because b"escrow" convert into bytes which store in u64 form
    pub maker: Pubkey,// hold pubkey of owner wallet address of escrow contract
    pub mint_a: Pubkey,// token_a mint address 
    pub mint_b: Pubkey,//token _b mint address
    pub receive: u64,//holding reciever address where the tokens come from
    pub bump: u8
}