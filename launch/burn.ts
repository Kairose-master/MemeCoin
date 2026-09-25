/**
 * Burn the launch dev buy. This does not prove that the creator will never hold tokens again.
 *   WALLET_SECRET_B58=<PumpPortal wallet secret> npx tsx burn.ts <mint>
 * Keep the secret local. Never put it in the repository, a server, or a chat.
 * SPL Token burn permanently removes the selected token amount from circulation.
 */
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { burn, getAssociatedTokenAddress, getAccount, TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import bs58 from "bs58";

const mint = new PublicKey(process.argv[2] ?? "");
const secret = process.env.WALLET_SECRET_B58; if (!secret) throw new Error("WALLET_SECRET_B58 is required");
const owner = Keypair.fromSecretKey(bs58.decode(secret));
const conn = new Connection(process.env.RPC_URL ?? "https://api.mainnet-beta.solana.com", "confirmed");

(async () => {
  for (const program of [TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID]) {
    try {
      const ata = await getAssociatedTokenAddress(mint, owner.publicKey, false, program);
      const acc = await getAccount(conn, ata, "confirmed", program);
      if (acc.amount === 0n) { console.log("Zero balance —", program.toBase58().slice(0, 8)); continue; }
      const sig = await burn(conn, owner, ata, mint, owner, acc.amount, [], undefined, program);
      console.log("BURNED", acc.amount.toString(), "raw units", "\nhttps://solscan.io/tx/" + sig);
      return;
    } catch (e) { console.log("skip", program.toBase58().slice(0, 8), (e as Error).message.slice(0, 80)); }
  }
})();
