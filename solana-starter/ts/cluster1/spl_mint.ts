import {
    Keypair,
    Connection,
    Commitment,
    PublicKey,
    Transaction,
    sendAndConfirmTransaction,
    SendTransactionError
} from "@solana/web3.js";
import {
    getOrCreateAssociatedTokenAccount,
    mintTo,
    createMintToInstruction,
} from '@solana/spl-token';

import PAYER_ADDRESS from '../keypairs/payer_keypair_1.json';
import MINT_ADDRESS from '../keypairs/mint_keypair_1.json';

const payer = Keypair.fromSecretKey(new Uint8Array(PAYER_ADDRESS));
const mint = Keypair.fromSecretKey(new Uint8Array(MINT_ADDRESS));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

const token_decimals = 1_000_000n;

(async () => {
    try {
        // Create an ATA
        const ata = await getOrCreateAssociatedTokenAccount(
            connection,
            payer,
            mint.publicKey,
            payer.publicKey
        );

        console.log(`Your ata is: ${ata.address.toBase58()}`);

        // "Mint to ATA" Instruction
        const mintIx = createMintToInstruction(
            mint.publicKey,
            ata.address,
            payer.publicKey,
            token_decimals
        );

        const mintTx = new Transaction().add(
            mintIx
        );

        console.log(`Your mint txid: ${mintTx}`);

        const signature = await sendAndConfirmTransaction(
            connection,
            mintTx,
            [payer]
        );

        console.log(
            `
            Token minted to ATA !!
            Check transaction:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet
            `
        );

    } catch (error) {
        if (error instanceof SendTransactionError) {
            const transactionErrorDetails = await error.getLogs(connection);
            console.log(transactionErrorDetails);
            return
        }

        console.log(`Oops, something went wrong: ${error}`)
    }
})()