import wallet from "../turbin3-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"
import { readFile } from "fs/promises";
import { url } from "inspector";

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader({address:"https://devnet.irys.xyz/"}));
umi.use(signerIdentity(signer));

(async () => {
    try {
        // Following this JSON schema as the other one is deprecated
        // https://developers.metaplex.com/smart-contracts/core/json-schema
        const image = "https://gateway.irys.xyz/AUxRG2GCmVa1U7n5P9eCAjPDRh32CAQcPhS8LNVufPd3";
        const metadata = {
            "name": "Persian rug #0001",
            "description": "A unique digital rug from the Persian rug collection. Hand-crafted pixel art inspired by traditional Persian rug patterns, woven into the blockchain.",
            "image": image,
            "attributes": [
              {
                "trait_type": "Pattern",
                "value": "Persian"
              },
              {
                "trait_type": "Color Scheme",
                "value": "Red & Light Blue"
              },
              {
                "trait_type": "Size",
                "value": "Medium"
              },
              {
                "trait_type": "Border Style",
                "value": "Ornate"
              },
              {
                "trait_type": "Rarity",
                "value": "Common"
              },
              {
                "trait_type": "Condition",
                "value": "Mint"
              }
            ],
            "properties": {
              "files": [
                {
                  "uri": image,
                  "type": "image/png"
                }
              ],
              "category": "image"
            }
        };
        const myMetadataUri = await umi.uploader.uploadJson(metadata).catch((err) => {
            throw new Error(err)
        });
        console.log("Your metadata URI: ", myMetadataUri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();