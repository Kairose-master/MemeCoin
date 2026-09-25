/**
 * 창설 매수(dev buy) 소각 — "creator 물량 0" 을 문자 그대로 만든다.
 *   WALLET_SECRET_B58=<PumpPortal 지갑 비밀키> npx tsx burn.ts <mint>
 * 비밀키는 이 명령을 치는 로컬에만 둔다. 저장소·서버·채팅에 절대 넣지 않는다.
 * SPL Token 의 burn 명령 — 토큰을 존재 자체에서 지운다 (소각 주소 전송보다 명확).
 */
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { burn, getAssociatedTokenAddress, getAccount, TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import bs58 from "bs58";

const mint = new PublicKey(process.argv[2] ?? "");
const secret = process.env.WALLET_SECRET_B58; if (!secret) throw new Error("WALLET_SECRET_B58 없음");
const owner = Keypair.fromSecretKey(bs58.decode(secret));
const conn = new Connection(process.env.RPC_URL ?? "https://api.mainnet-beta.solana.com", "confirmed");

(async () => {
  for (const program of [TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID]) {
    try {
      const ata = await getAssociatedTokenAddress(mint, owner.publicKey, false, program);
      const acc = await getAccount(conn, ata, "confirmed", program);
      if (acc.amount === 0n) { console.log("잔고 0 —", program.toBase58().slice(0, 8)); continue; }
      const sig = await burn(conn, owner, ata, mint, owner, acc.amount, [], undefined, program);
      console.log("BURNED", acc.amount.toString(), "raw units", "\nhttps://solscan.io/tx/" + sig);
      return;
    } catch (e) { console.log("skip", program.toBase58().slice(0, 8), (e as Error).message.slice(0, 80)); }
  }
})();
