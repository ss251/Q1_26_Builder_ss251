import wallet from "../turbin3-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        // Follow this JSON structure
        // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

        const image = "https://gateway.irys.xyz/EAWtfhd7gHZgouFbNXLjY81h8NxB2fxvmCYveA8j4JaM"
        const metadata = {
            name: "MagicRug",
            symbol: "MRUG",
            description: "Magic rug NFT from week 1 Turbin3 Builder's Q126",
            image,
            attributes: [
                {trait_type: 'magic', value: '42'}
            ],
            properties: {
                files: [
                    {
                        type: "image/png",
                        uri: "https://gateway.irys.xyz/EAWtfhd7gHZgouFbNXLjY81h8NxB2fxvmCYveA8j4JaM"
                    },
                ]
            },
            creators: [
                {
                    address: signer.publicKey,
                    share: 100
                }
            ]
        };
        const myUri = await umi.uploader.uploadJson(metadata)
        console.log("Your metadata URI: ", myUri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
